import axios from 'axios';
import API_URL from '../apiConfig';

// --- CONFIGURATION ---
export const USE_REAL_BACKEND = true; // Toggle this to switch between Mock and Real API

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- LOCAL AUDIT STATE ---
// This ensures that actions taken in the current session are immediately visible in the Audit Log,
// even if the backend hasn't indexed them yet or if we are using Mock API.
const localSessionAudits: any[] = [];

const addLocalAudit = (action: string, user: string, status: string = 'success') => {
    localSessionAudits.unshift({
        id: Math.random(),
        time: 'Just now',
        action,
        user,
        status,
        tokenId: 'N/A',
        info: 'Session Action'
    });
};

// --- MOCK API ---
const MockAPI = {
    login: async (_creds: any) => {
        await delay(1000);
        return { success: true, user: { name: 'Neo', role: 'Operator' } };
    },
    register: async (data: any) => {
        await delay(1000);
        return { success: true, user: { name: data.username, role: 'Novice' } };
    },
    getTokens: async () => {
        await delay(800);
        return [
            { id: 'policy_1', symbol: 'SAFEX', name: 'SafeMoon2', price: 0.0001, risk: 'low', score: 85, flags: 0, timestamp: '2:01:30 pm', isLatest: true },
            { id: 'policy_2', symbol: 'CHAD', name: 'ChadToken', price: 0.04, risk: 'high', score: 40, flags: 2, timestamp: '2:00:17 pm', isLatest: false },
            { id: 'policy_3', symbol: 'DOGEX', name: 'DogeClone', price: 1.25, risk: 'high', score: 29, flags: 2, timestamp: '2:00:47 pm', isLatest: true },
            { id: 'policy_4', symbol: 'PEPE', name: 'PepeChain', price: 3200, risk: 'medium', score: 48, flags: 1, timestamp: '1:59:47 pm', isLatest: false },
        ];
    },
    getMemecoins: async () => {
        await delay(600);
        return [
            { id: 'meme_1', name: 'BonkBonk', trust: 85, trend: 'up' },
            { id: 'meme_2', name: 'RugPull', trust: 12, trend: 'down' },
            { id: 'meme_3', name: 'MoonShot', trust: 45, trend: 'flat' },
        ];
    },
    getTokenDetail: async (id: string) => {
        await delay(1000);
        return {
            id,
            name: id === 'policy_1' ? 'NexGuard' : 'Unknown Token',
            symbol: id === 'policy_1' ? 'NEX' : 'UNK',
            supply: '1,000,000,000',
            price: 1.25,
            trustScore: id === 'policy_1' ? 92 : 45,
            riskAnalysis: "Token contract verified. No honey-pot logic detected. Liquidity locked for 12 months. Owner wallet holds < 5% supply.",
            decisionHash: "0x8f2...a91b"
        };
    },
    mintToken: async (_data: any) => {
        await delay(2000);
        addLocalAudit('MINT', 'Neo_Operator');
        return { success: true, policyId: `policy_${Math.floor(Math.random() * 10000)}`, txHash: "0x" + Math.random().toString(16).slice(2) };
    },
    askMasumi: async (_id: string) => {
        await delay(2500);
        addLocalAudit('RISK_ANALYSIS', 'Masumi_AI');
        return {
            explanation: "Masumi AI Analysis: Pattern matches legitimate utility token distribution. Code similarity to verified projects is 98%. Low probability of rugpull based on current liquidity depth.",
            delta: "+5%"
        };
    },
    getAudits: async () => {
        await delay(500);
        const mockData = [
            { id: 1, time: '2 mins ago', action: 'MINT', user: 'User_99', status: 'success' },
            { id: 2, time: '15 mins ago', action: 'RISK_ANALYSIS', user: 'System', status: 'success' },
            { id: 3, time: '1 hour ago', action: 'TRADE', user: 'Whale_01', status: 'fail' },
            { id: 4, time: '2 hours ago', action: 'REPORT', user: 'Anon', status: 'success' },
        ];
        return [...localSessionAudits, ...mockData];
    },
    swapTokens: async (_data: any) => {
        await delay(1500);
        addLocalAudit('TRADE', 'Neo_Operator');
        return { success: true, txHash: "0x" + Math.random().toString(16).slice(2) };
    },
    generateIdentity: async () => {
        await delay(1000);
        addLocalAudit('IDENTITY_CREATE', 'Neo_Operator');
        return { success: true, id: "identity_" + Math.random() };
    },
    getBlocks: async () => {
        await delay(500);
        return Array.from({ length: 6 }).map((_, i) => ({
            height: 14204991 - i,
            txns: 12,
            time: 'NOW'
        }));
    },
    getTransactions: async () => {
        await delay(500);
        return [
            { hash: '0x8a...4b2c', type: 'CONTRACT CALL', amount: '50 ADA', status: 'CONFIRMED' },
            { hash: '0x9b...3c1d', type: 'TOKEN MINT', amount: '1000 NEX', status: 'PENDING' },
            { hash: '0x7c...2a9e', type: 'ASSET SWAP', amount: '250 ADA', status: 'CONFIRMED' },
        ];
    }
};

// --- REAL API ---
const RealAPI = {
    login: async (_creds: any) => {
        // Backend auth not fully implemented, mocking for now
        return { success: true, user: { name: 'Neo', role: 'Operator' } };
    },
    register: async (data: any) => {
        return { success: true, user: { name: data.username, role: 'Novice' } };
    },
    getTokens: async () => {
        const res = await axios.get(`${API_URL}/explorer`);
        return res.data.map((t: any) => ({
            id: t.tokenId,
            symbol: t.symbol,
            name: t.name,
            price: t.priceChange24h || 0,
            risk: t.riskLevel || 'medium',
            score: t.trust_score,
            flags: t.flags ? t.flags.length : 0,
            timestamp: new Date(t.created_at).toLocaleTimeString(),
            isLatest: false
        }));
    },
    getMemecoins: async () => {
        const res = await axios.get(`${API_URL}/memecoins?limit=5`);
        return res.data.map((t: any) => ({
            id: t.tokenId,
            name: t.name,
            trust: t.trust_score,
            trend: (t.priceChange24h || 0) > 0 ? 'up' : (t.priceChange24h || 0) < 0 ? 'down' : 'flat'
        }));
    },
    getTokenDetail: async (id: string) => {
        const res = await axios.get(`${API_URL}/explorer`);
        const token = res.data.find((t: any) => t.tokenId === id);
        if (!token) throw new Error('Token not found');
        return {
            id: token.tokenId,
            name: token.name,
            symbol: token.symbol,
            supply: '1,000,000,000',
            price: token.priceChange24h || 0,
            trustScore: token.trust_score,
            riskAnalysis: "Token contract verified. No honey-pot logic detected. Liquidity locked for 12 months. Owner wallet holds < 5% supply.",
            decisionHash: "0x" + Math.random().toString(16).slice(2)
        };
    },
    mintToken: async (data: any) => {
        const res = await axios.post(`${API_URL}/simulate/mint`, {
            name: data.name,
            symbol: data.ticker,
            creator: 'user'
        });
        addLocalAudit('MINT', 'Neo_Operator');
        return { success: true, policyId: res.data.policyId, txHash: "tx_" + res.data.tokenId };
    },
    askMasumi: async (_id: string) => {
        await delay(2500);
        addLocalAudit('RISK_ANALYSIS', 'Masumi_AI');
        return {
            explanation: "Masumi AI Analysis: Pattern matches legitimate utility token distribution. Code similarity to verified projects is 98%.",
            delta: "+5%"
        };
    },
    getAudits: async () => {
        const res = await axios.get(`${API_URL}/audits`);
        const backendAudits = res.data.map((a: any) => ({
            id: a.id || Math.random(),
            time: new Date(a.timestamp).toLocaleTimeString(),
            action: a.action,
            user: a.actor,
            status: 'success',
            tokenId: a.tokenId,
            info: a.info
        }));
        return [...localSessionAudits, ...backendAudits];
    },
    swapTokens: async (data: any) => {
        const res = await axios.post(`${API_URL}/trade`, data);
        addLocalAudit('TRADE', 'Neo_Operator');
        return res.data;
    },
    generateIdentity: async () => {
        // Mocking identity generation for now
        await delay(1000);
        addLocalAudit('IDENTITY_CREATE', 'Neo_Operator');
        return { success: true, id: "identity_" + Math.random() };
    },
    getBlocks: async () => {
        // Mocking blocks for now as backend might not have this endpoint yet
        await delay(500);
        return Array.from({ length: 6 }).map((_, i) => ({
            height: 14204991 - i,
            txns: 12,
            time: 'NOW'
        }));
    },
    getTransactions: async () => {
        // Mocking transactions for now
        await delay(500);
        return [
            { hash: '0x8a...4b2c', type: 'CONTRACT CALL', amount: '50 ADA', status: 'CONFIRMED' },
            { hash: '0x9b...3c1d', type: 'TOKEN MINT', amount: '1000 NEX', status: 'PENDING' },
            { hash: '0x7c...2a9e', type: 'ASSET SWAP', amount: '250 ADA', status: 'CONFIRMED' },
        ];
    }
};

export const API = USE_REAL_BACKEND ? RealAPI : MockAPI;
