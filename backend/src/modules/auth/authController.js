const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../users/userModel');
const passport = require('passport');
const https = require('https');

// JWT Helper
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, cpf, role } = req.body;

    // Validate CPF (implement validation logic)
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'Invalid CPF' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email, password, cpf, role });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Auth
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Callback
exports.googleCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  })(req, res);
};

// Google Mobile: verify idToken and create/find user
exports.googleMobile = (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'idToken is required' });

  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', async () => {
      try {
        const payload = JSON.parse(data);
        if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
          return res.status(401).json({ message: 'Invalid Google client ID' });
        }

        const email = payload.email;
        const name = payload.name || payload.email.split('@')[0];
        const googleId = payload.sub;

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({ name, email, googleId, password: Math.random().toString(36).slice(-8) });
          await user.save();
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }

        const token = generateToken(user);
        return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
      } catch (e) {
        return res.status(400).json({ message: 'Invalid token payload' });
      }
    });
  }).on('error', (err) => {
    return res.status(500).json({ message: 'Failed to verify token' });
  });
};

// CPF Validation (simple check)
const validateCPF = (cpf) => {
  // Remove dots and dashes
  const cleanCPF = cpf.replace(/\D/g, '');
  // Check if has 11 digits
  return cleanCPF.length === 11;
};