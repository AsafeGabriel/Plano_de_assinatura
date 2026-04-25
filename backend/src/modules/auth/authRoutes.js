const express = require('express');
const passport = require('passport');
const { register, login, googleAuth, googleCallback, googleMobile } = require('./authController');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/google/mobile', googleMobile);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;