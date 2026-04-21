const express = require('express');
const Professional = require('../models/Professional');

const router = express.Router();

// Get all professionals
router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find();
        res.json(professionals);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get professional by id
router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id);
        res.json(professional);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;