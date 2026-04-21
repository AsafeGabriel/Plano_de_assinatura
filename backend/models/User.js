const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'professional'], default: 'patient' },
    plan: { type: String, default: null }, // e.g., 'basic', 'intermediate', 'premium'
    consultationsLeft: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);