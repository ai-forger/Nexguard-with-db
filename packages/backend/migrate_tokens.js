const { initDb, getAllTokens } = require('./src/services/db');
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

    const tokens = await Token.find({});
    console.log(`Found ${tokens.length} tokens.`);

    for (const token of tokens) {
        let updated = false;
        if (!token.flags) {
            token.flags = [];
            updated = true;
        }
        if (!token.riskLevel) {
            token.riskLevel = 'medium';
            updated = true;
        }
        if (token.priceChange24h === undefined) {
            token.priceChange24h = 0;
            updated = true;
        }

        if (updated) {
            await token.save();
            console.log(`Updated token ${token.symbol}`);
        }
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
