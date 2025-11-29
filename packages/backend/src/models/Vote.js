const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    tokenId: { type: String, required: true, unique: true },
    agree: { type: Number, default: 0 },
    disagree: { type: Number, default: 0 }
});

module.exports = mongoose.model('Vote', voteSchema);
