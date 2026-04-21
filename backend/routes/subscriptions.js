const express = require('express');
const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');
const Professional = require('../models/Professional');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Subscribe
router.post('/', verifyToken, async (req, res) => {
    const { professionalId, plan, duration, price } = req.body;
    try {
        const subscription = new Subscription({
            user: req.user.id,
            professional: professionalId,
            plan,
            duration,
            price,
        });
        await subscription.save();

        // Update professional balance and clients
        await Professional.findByIdAndUpdate(professionalId, {
            $inc: { balance: price },
            $push: { clients: req.user.id },
        });

        // Update user plan and consultations
        const consultations = plan === 'basic' ? 1 : plan === 'intermediate' ? 2 : 3;
        await User.findByIdAndUpdate(req.user.id, {
            plan,
            consultationsLeft: consultations,
        });

        res.status(201).json(subscription);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get subscriptions for user
router.get('/', verifyToken, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id }).populate('professional');
        res.json(subscriptions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;