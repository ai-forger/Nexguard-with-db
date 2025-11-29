import { useState } from 'react';
import { Activity, ArrowDownUp, ShieldCheck, Wallet } from 'lucide-react';
import { Card, Button } from './CyberTheme';
import { API } from '../services/api';

export const TradePage = () => {
    const [payAmount, setPayAmount] = useState('');
    const [receiveAmount, setReceiveAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSwap = async () => {
        if (!payAmount) return;
        setLoading(true);
        setStatus('idle');
        try {
            await API.swapTokens({
                from: 'ADA',
                to: 'NEX',
                amount: parseFloat(payAmount)
            });
            setStatus('success');
            setPayAmount('');
            setReceiveAmount('');
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
            <div className="w-full max-w-md relative">

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

                <Card className="relative z-10 border-emerald-500/30 bg-[#050806]/90 backdrop-blur-xl p-0 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center">
                        <h2 className="text-xl font-brand font-bold text-white tracking-wider">SWAP ASSETS</h2>
                        <Activity className="text-emerald-500 animate-pulse" size={20} />
                    </div>

                    <div className="p-6 space-y-2">

                        {/* YOU PAY */}
                        <div className="bg-[#010402] border border-emerald-500/20 rounded-lg p-4 transition-all focus-within:border-emerald-500/50">
                            <div className="flex justify-between text-xs font-mono text-emerald-500/50 mb-2">
                                <span>YOU PAY</span>
                                <span className="flex items-center gap-1"><Wallet size={10} /> BAL: 1,420.50</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) => {
                                        setPayAmount(e.target.value);
                                        setReceiveAmount((parseFloat(e.target.value || '0') * 12.5).toFixed(2));
                                    }}
                                    placeholder="0.0"
                                    className="bg-transparent text-3xl font-brand font-bold text-white focus:outline-none w-full placeholder-emerald-900/50"
                                />
                                <div className="flex items-center gap-2 bg-emerald-900/20 px-3 py-1.5 rounded border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10">
                                    <span className="font-bold text-emerald-400">ADA</span>
                                </div>
                            </div>
                        </div>

                        {/* Swap Icon */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <div className="bg-[#050806] border border-emerald-500/30 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <ArrowDownUp className="text-emerald-500" size={18} />
                            </div>
                        </div>

                        {/* YOU RECEIVE */}
                        <div className="bg-[#010402] border border-emerald-500/20 rounded-lg p-4 transition-all focus-within:border-emerald-500/50">
                            <div className="flex justify-between text-xs font-mono text-emerald-500/50 mb-2">
                                <span>YOU RECEIVE</span>
                                <span className="flex items-center gap-1"><Wallet size={10} /> BAL: 0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={receiveAmount}
                                    readOnly
                                    placeholder="0.0"
                                    className="bg-transparent text-3xl font-brand font-bold text-emerald-500 focus:outline-none w-full placeholder-emerald-900/50"
                                />
                                <div className="flex items-center gap-2 bg-emerald-900/20 px-3 py-1.5 rounded border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10">
                                    <span className="font-bold text-emerald-400">NEX</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleSwap}
                                isLoading={loading}
                                className="h-14 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                {loading ? 'SWAPPING...' : 'INITIATE SWAP'}
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-emerald-500/40 uppercase tracking-widest">
                                <ShieldCheck size={12} />
                                Route Protected by NexGuard
                            </div>
                        </div>

                        {status === 'success' && (
                            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-center text-emerald-400 text-xs font-mono animate-in fade-in slide-in-from-top-2">
                                SWAP SUCCESSFUL: TX_HASH_#8921...99
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </div>
    );
};
