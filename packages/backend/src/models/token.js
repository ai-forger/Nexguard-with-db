const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  trust_score: { type: Number, default: 50 },
  policyId: { type: String },
  yaci_data: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now },
  isDisputed: { type: Boolean, default: false },
  source: { type: String, default: 'simulation' },
  // For meme factory
  reports_count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Token', tokenSchema);
