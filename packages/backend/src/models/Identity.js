const mongoose = require('mongoose');

const identitySchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    username: { type: String },
    astrology: { type: String },
    traits: { type: Array, default: [] }
});

module.exports = mongoose.model('Identity', identitySchema);
