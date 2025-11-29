const { initDb } = require('./src/services/db');
const Token = require('./src/models/Token');
const mongoose = require('mongoose');

async function migrate() {
    console.log('Initializing DB...');
    initDb();

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected!');
        process.exit(1);
    }
    console.log('MongoDB connected.');

    // Use lean() to get raw objects without defaults
    const tokens = await Token.find({}).lean();
    console.log(`Found ${tokens.length} tokens.`);

    let count = 0;
    for (const token of tokens) {
        const update = {};
        if (!token.flags) update.flags = [];
        if (!token.riskLevel) update.riskLevel = 'medium';
        if (token.priceChange24h === undefined) update.priceChange24h = 0;

        if (Object.keys(update).length > 0) {
            await Token.updateOne({ _id: token._id }, { $set: update });
            console.log(`Updated token ${token.symbol}`);
            count++;
        }
    }

    console.log(`Migration complete. Updated ${count} tokens.`);
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
