const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function testIntegration() {
    console.log('--- Starting Integration Test ---');
    console.log(`Target API: ${API_URL}`);

    try {
        // 1. Test Identity Generation Persistence
        console.log('\n1. Testing Identity Generation...');
        const seed = 'test_user_' + Date.now();
        let identityRes;
        try {
            identityRes = await axios.post(`${API_URL}/api/generate-meme-identity`, { seed });
            console.log(`   Identity Created: ${identityRes.data.username}`);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.username === 'FallbackDoge') {
                console.log('   Identity Created (Fallback): FallbackDoge');
                identityRes = err.response;
            } else {
                throw err;
            }
        }

        // 2. Test Risk Analysis Persistence
        console.log('\n2. Testing Risk Analysis...');
        const policyId = 'policy_test_' + Date.now();
        const analysisRes = await axios.post(`${API_URL}/risk/${policyId}/ask-masumi`, { assetName: 'TestAsset' });
        console.log(`   Analysis Result: ${analysisRes.data.risk_level} (${analysisRes.data.rug_probability}%)`);

        // 3. Test Minting Persistence
        console.log('\n3. Testing Minting...');
        const mintRes = await axios.post(`${API_URL}/api/simulate/mint`, { name: 'TestMint', symbol: 'TMNT', creator: 'TestUser' });
        const mintTokenId = mintRes.data.tokenId;
        console.log(`   Minted Token: ${mintTokenId}`);

        // 4. Test Trading Persistence
        console.log('\n4. Testing Trading...');
        await axios.post(`${API_URL}/api/trade`, { tokenId: mintTokenId, type: 'buy', amount: 100, trader: 'TraderJoe' });
        console.log(`   Trade Executed on ${mintTokenId}`);

        // 5. Test Voting Persistence
        console.log('\n5. Testing Voting...');
        await axios.post(`${API_URL}/api/vote`, { tokenId: mintTokenId, vote: 'agree', voterId: 'VoterAlice' });
        console.log(`   Vote Cast on ${mintTokenId}`);

        // 6. Test Reporting Persistence
        console.log('\n6. Testing Reporting...');
        await axios.post(`${API_URL}/api/report`, { tokenId: mintTokenId, reportText: 'Suspicious activity', reporterId: 'Whistleblower' });
        console.log(`   Report Submitted on ${mintTokenId}`);

        // 7. Verify Audit Logs
        console.log('\n7. Verifying Audit Logs in DB...');
        // Wait a moment for async DB writes
        await new Promise(resolve => setTimeout(resolve, 2000));

        const auditsRes = await axios.get(`${API_URL}/api/audits`);
        const audits = auditsRes.data;
        console.log(`   Fetched ${audits.length} audit logs.`);

        const identityLog = audits.find(a => a.action === 'IDENTITY_CREATE' && a.info.includes(seed));
        const analysisLog = audits.find(a => a.action === 'RISK_ANALYSIS' && a.tokenId === policyId);
        const mintLog = audits.find(a => a.action === 'MINT' && a.tokenId === mintTokenId);
        const tradeLog = audits.find(a => a.action === 'TRADE' && a.tokenId === mintTokenId);
        const voteLog = audits.find(a => a.action === 'VOTE' && a.tokenId === mintTokenId);
        const reportLog = audits.find(a => a.action === 'WHISTLEBLOWER_REPORT' && a.tokenId === mintTokenId);

        const checks = [
            { name: 'Identity', val: identityLog },
            { name: 'Risk Analysis', val: analysisLog },
            { name: 'Mint', val: mintLog },
            { name: 'Trade', val: tradeLog },
            { name: 'Vote', val: voteLog },
            { name: 'Report', val: reportLog }
        ];

        let allPass = true;
        checks.forEach(check => {
            if (check.val) {
                console.log(`   [PASS] ${check.name} Log found.`);
            } else {
                console.error(`   [FAIL] ${check.name} Log NOT found!`);
                allPass = false;
            }
        });

        if (allPass) {
            console.log('\n--- Integration Test PASSED ---');
        } else {
            console.log('\n--- Integration Test FAILED ---');
            console.log('Identity Log:', identityLog);
            console.log('Analysis Log:', analysisLog);
            console.log('Mint Log:', mintLog);
            console.log('Trade Log:', tradeLog);
            console.log('Vote Log:', voteLog);
            console.log('Report Log:', reportLog);
            process.exit(1);
        }

    } catch (error) {
        console.error('\n[ERROR] Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received. Request details:', error.request);
        } else {
            console.error('Error details:', error.stack);
        }
        process.exit(1);
    }
}

testIntegration();
