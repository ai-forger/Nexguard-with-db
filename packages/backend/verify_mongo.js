const { initDb, insertToken, getAllTokens } = require('./src/services/db');
const mongoose = require('mongoose');

async function verify() {
    console.log('Initializing DB...');
    initDb();

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected!');
        process.exit(1);
    }
    console.log('MongoDB connected.');

    console.log('Inserting test token...');
    const testToken = {
        tokenId: 'test_' + Date.now(),
        name: 'TestCoin',
        symbol: 'TEST',
        trust_score: 99,
        source: 'verification'
    };

    await insertToken(testToken);
    console.log('Token inserted.');

    console.log('Fetching all tokens...');
    const tokens = await getAllTokens();
    console.log(`Found ${tokens.length} tokens.`);

    const found = tokens.find(t => t.tokenId === testToken.tokenId);
    if (found) {
        console.log('Test token found in DB!');
    } else {
        console.error('Test token NOT found in DB!');
        process.exit(1);
    }

    console.log('Verification successful.');
    process.exit(0);
}

verify().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
