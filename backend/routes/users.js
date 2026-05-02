const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get users optionally filtered by role
router.get('/', async (req, res) => {
    try {
        const { role } = req.query;
        const filter = {};

        if (role) {
            filter.role = role;
        }

        const users = await User.find(filter).select('name email role cpf plan consultationsLeft createdAt');
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
