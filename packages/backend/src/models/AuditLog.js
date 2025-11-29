const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    tokenId: { type: String },
    action: { type: String, required: true },
    actor: { type: String, required: true },
    info: { type: String },
    analysisHash: { type: String },
    txid: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
