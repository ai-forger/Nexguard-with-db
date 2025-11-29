const mongoose = require('mongoose');
const Token = require('../models/Token');
const Report = require('../models/Report');
const Vote = require('../models/Vote');
const AuditLog = require('../models/AuditLog');
const Identity = require('../models/Identity');
require('dotenv').config();

// Initialize DB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nexguard';

function initDb() {
    mongoose.connect(MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Error connecting to MongoDB:', err));
}

// --- Audit Logs ---

async function insertAuditLog(log) {
    const newLog = new AuditLog(log);
    return await newLog.save();
}

async function getAuditLogs(tokenId) {
    if (tokenId) {
        return await AuditLog.find({ tokenId }).sort({ timestamp: -1 });
    }
    return await AuditLog.find().sort({ timestamp: -1 }).limit(100);
}

// --- Tokens ---

async function insertToken(token) {
    // Ensure yaci_data is an object, not a string
    if (typeof token.yaci_data === 'string') {
        try {
            token.yaci_data = JSON.parse(token.yaci_data);
        } catch (e) {
            token.yaci_data = {};
        }
    }
    const newToken = new Token(token);
    return await newToken.save();
}

async function getToken(tokenId) {
    const token = await Token.findOne({ tokenId });
    if (token) {
        // Mongoose returns a document, convert to object if needed, but properties are accessible
        // Handling legacy structure where yaci_data might have been stored as string in SQLite but here it is Object
        return token.toObject();
    }
    return null;
}

async function getAllTokens() {
    return await Token.find().sort({ created_at: -1 });
}

async function updateTokenTrust(tokenId, trust_score, isDisputed) {
    return await Token.updateOne({ tokenId }, { trust_score, isDisputed });
}

// --- Reports ---

async function insertReport(report) {
    const newReport = new Report(report);
    return await newReport.save();
}

async function getReports(tokenId) {
    return await Report.find({ tokenId });
}

// --- Votes ---

async function getVote(tokenId) {
    const vote = await Vote.findOne({ tokenId });
    return vote || { tokenId, agree: 0, disagree: 0 };
}

async function updateVote(tokenId, voteType) {
    const update = voteType === 'agree'
        ? { $inc: { agree: 1 } }
        : { $inc: { disagree: 1 } };

    return await Vote.findOneAndUpdate(
        { tokenId },
        update,
        { upsert: true, new: true }
    );
}

// --- Identities ---

async function saveIdentity(identity) {
    return await Identity.findOneAndUpdate(
        { address: identity.address },
        identity,
        { upsert: true, new: true }
    );
}

async function getIdentity(address) {
    return await Identity.findOne({ address });
}

module.exports = {
    initDb,
    insertAuditLog, getAuditLogs,
    insertToken, getToken, getAllTokens, updateTokenTrust,
    insertReport, getReports,
    getVote, updateVote,
    saveIdentity, getIdentity
};
