const express = require('express');
const Professional = require('../models/Professional');
const User = require('../models/User');

const router = express.Router();

// Get all professionals
router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find();
        const userProfessionals = await User.find({ role: 'professional' }).select('name email role cpf createdAt');

        const normalizedUserProfessionals = userProfessionals.map((user) => ({
            _id: user._id,
            name: user.name,
            specialty: 'Especialidade não informada',
            rating: 0,
            price: 'A consultar',
            image: 'https://i.pravatar.cc/150?img=12',
            availability: 'Disponível',
            raw: user,
        }));

        res.json([...professionals, ...normalizedUserProfessionals]);
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