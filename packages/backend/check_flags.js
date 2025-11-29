const Token = require('./src/models/Token');
const mongoose = require('mongoose');

async function checkFlags() {
    initDb();
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tokens = await Token.find({}).lean();
    console.log(`Found ${tokens.length} tokens.`);
    tokens.forEach(t => {
        console.log(`Token: ${t.symbol}, Flags: ${t.flags}, Type: ${typeof t.flags}, IsArray: ${Array.isArray(t.flags)}`);
    });
    process.exit(0);
}

checkFlags();
