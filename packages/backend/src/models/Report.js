const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    tokenId: { type: String, required: true },
    reporterId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    zkProof: { type: Object }, // For ZK reports
    status: { type: String, default: 'pending' } // verified, pending, rejected
});

module.exports = mongoose.model('Report', reportSchema);
