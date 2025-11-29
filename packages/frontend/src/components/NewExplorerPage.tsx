import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';
import { Card } from './CyberTheme';
import { API } from '../services/api';

export const ExplorerPage = () => {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blocksData, txData] = await Promise.all([
                    API.getBlocks(),
                    API.getTransactions()
                ]);
                setBlocks(blocksData);
                setTransactions(txData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-4 lg:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-end border-b border-emerald-500/20 pb-4">
                    <div>
                        <h2 className="text-2xl font-brand font-bold text-white tracking-wider uppercase">
                            BLOCK EXPLORER
                        </h2>
                        <p className="text-emerald-500/50 font-mono text-xs tracking-widest mt-1">
                            VISUALIZING THE NEXGUARD LOGIC CHAIN.
                        </p>
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        HEIGHT: 14,204,992
                    </div>
                </div>

                {/* Latest Blocks */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">LATEST BLOCKS</h3>
                    <div className="relative group">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {loading ? (
                                [1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="min-w-[160px] h-32 bg-emerald-900/10 border border-emerald-500/10 animate-pulse rounded"></div>
                                ))
                            ) : (
                                blocks.map((block, i) => (
                                    <div key={i} className="min-w-[160px] bg-[#050806] border border-emerald-500/20 p-4 rounded hover:border-emerald-500/50 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-start mb-6">
                                            <Box className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" size={20} />
                                            <span className="text-[10px] font-mono text-emerald-500/30">{block.time}</span>
                                        </div>
                                        <div className="font-brand font-bold text-white text-lg">#{block.height}</div>
                                        <div className="text-xs font-mono text-emerald-500/50">{block.txns} TXNS</div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Scroll Bar Visual */}
                        <div className="h-1 w-full bg-emerald-900/20 rounded-full mt-2 overflow-hidden">
                            <div className="h-full w-1/3 bg-emerald-500/50 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Transactions */}
                    <Card className="h-96 p-0 border-emerald-500/30 bg-[#050806]/80 flex flex-col">
                        <div className="p-4 border-b border-emerald-500/20 flex items-center gap-2">
                            <span className="text-emerald-500 font-mono font-bold text-lg">{'>_'}</span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-brand">RECENT TRANSACTIONS</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {transactions.map((tx, i) => (
                                <div key={i} className="bg-[#010402] border border-emerald-500/10 p-3 rounded flex justify-between items-center hover:bg-emerald-500/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-900/20 rounded flex items-center justify-center border border-emerald-500/20">
                                            <Box size={14} className="text-emerald-500/50" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-mono text-emerald-400">{tx.hash}</div>
                                            <div className="text-[10px] font-mono text-emerald-500/40 uppercase">{tx.type}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-white font-brand">{tx.amount}</div>
                                        <div className="text-[10px] font-mono text-emerald-500 uppercase">{tx.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Raw Data Viewer */}
                    <Card className="h-96 p-0 border-emerald-500/30 bg-[#050806]/80 flex flex-col">
                        <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest font-brand">RAW DATA VIEWER</h3>
                            <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 rounded">JSON</div>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-[#010402] font-mono text-xs text-emerald-500/70">
                            <pre>{JSON.stringify({
                                block_height: 14204992,
                                hash: "000000000000000000045c...a82",
                                miner: "Pool_AD44",
                                transactions: [
                                    {
                                        hash: "0x8a...4b2c",
                                        inputs: [
                                            { prev_out: "0x3f...1a", index: 0 }
                                        ],
                                        outputs: [
                                            { value: 50000000, script: "OP_DUP..." }
                                        ]
                                    }
                                ],
                                size: 1240,
                                nonce: 8921004
                            }, null, 2)}</pre>
                        </div>
                    </Card>

                </div>

            </div>
        </div>
    );
};
