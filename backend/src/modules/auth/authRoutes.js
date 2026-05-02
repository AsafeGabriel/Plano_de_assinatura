const express = require('express');
const { register, login, googleMobile } = require('./authController');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/google/mobile', googleMobile);

module.exports = router;