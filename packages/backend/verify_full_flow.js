const { initDb, insertToken, getToken, updateVote, getVote, insertReport, getReports } = require('./src/services/db');
const mongoose = require('mongoose');

async function verifyFullFlow() {
    console.log('Initializing DB...');
    initDb();

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected!');
        process.exit(1);
    }
    console.log('MongoDB connected.');

    const tokenId = 'test_full_' + Date.now();

    // 1. Create Token
    console.log(`Creating token ${tokenId}...`);
    await insertToken({
        tokenId,
        name: 'FullFlowCoin',
        symbol: 'FFC',
        trust_score: 80,
        source: 'verification_full'
    });
    console.log('Token created.');

    // 2. Add Votes
    console.log('Adding votes...');
    await updateVote(tokenId, 'agree');
    await updateVote(tokenId, 'agree');
    await updateVote(tokenId, 'disagree');

    const votes = await getVote(tokenId);
    console.log('Votes fetched:', votes);
    if (votes.agree !== 2 || votes.disagree !== 1) {
        console.error('Vote count mismatch!');
        process.exit(1);
    }

    // 3. Add Report
    console.log('Adding report...');
    await insertReport({
        tokenId,
        reporterId: 'tester',
        text: 'This is a test report'
    });

    const reports = await getReports(tokenId);
    console.log(`Reports fetched: ${reports.length}`);
    if (reports.length !== 1 || reports[0].text !== 'This is a test report') {
        console.error('Report mismatch!');
        process.exit(1);
    }

    // 4. Verify Token Retrieval
    const token = await getToken(tokenId);
    if (!token) {
        console.error('Token retrieval failed!');
        process.exit(1);
    }
    console.log('Token retrieved successfully:', token.name);

    console.log('Full flow verification successful!');
    process.exit(0);
}

verifyFullFlow().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
