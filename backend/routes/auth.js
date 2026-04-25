const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User');

const router = express.Router();

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

// Register - return token + user
router.post('/register', async (req, res) => {
    const { name, email, password, role, cpf } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already in use' });

        let hashedPassword = null;
        if (password) hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role, cpf });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (user.password) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        } else {
            // User exists but has no password (e.g., created via Google)
            return res.status(401).json({ error: 'Use Google login for this account' });
        }

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Google mobile: verify idToken with Google's tokeninfo endpoint
router.post('/google/mobile', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken is required' });

    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', async () => {
            try {
                const payload = JSON.parse(data);

                // validate audience
                if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
                    return res.status(401).json({ error: 'Invalid Google client ID' });
                }

                const email = payload.email;
                const name = payload.name || payload.email.split('@')[0];
                const googleId = payload.sub;

                let user = await User.findOne({ email });
                if (!user) {
                    user = new User({ name, email, googleId });
                    await user.save();
                } else if (!user.googleId) {
                    user.googleId = googleId;
                    await user.save();
                }

                const token = generateToken(user);
                return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
            } catch (e) {
                return res.status(400).json({ error: 'Invalid token payload' });
            }
        });
    }).on('error', (err) => {
        return res.status(500).json({ error: 'Failed to verify token' });
    });
});

module.exports = router;