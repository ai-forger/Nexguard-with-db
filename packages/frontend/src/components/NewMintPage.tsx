import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button, Card } from './CyberTheme';
import { API } from '../services/api';

export const MintPage = () => {
    const [formData, setFormData] = useState({ name: '', ticker: '', supply: 1000000 });
    const [status, setStatus] = useState<'idle' | 'minting' | 'success'>('idle');
    const [result, setResult] = useState<any>(null);

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('minting');
        try {
            const res = await API.mintToken(formData);
            setResult(res);
            setStatus('success');
        } catch (e) {
            console.error(e);
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-brand font-bold text-white mb-2">MINT ASSET</h1>
                <p className="text-emerald-500/60 font-mono text-sm">Deploy standard asset to NexGuard testnet.</p>
            </div>

            <Card className="border-t-4 border-t-emerald-500 relative overflow-hidden">
                {status === 'success' ? (
                    <div className="text-center py-10 space-y-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-brand font-bold text-white">DEPLOYMENT SUCCESSFUL</h2>
                        <div className="bg-[#010402] border border-emerald-500/20 p-4 text-left font-mono text-xs space-y-3">
                            <div className="flex justify-between">
                                <span className="text-emerald-500/50">POLICY_ID</span>
                                <span className="text-emerald-400 select-all">{result?.policyId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-500/50">TX_HASH</span>
                                <span className="text-emerald-100/70 select-all">{result?.txHash}</span>
                            </div>
                        </div>
                        <Button onClick={() => setStatus('idle')} variant="secondary">MINT ANOTHER</Button>
                    </div>
                ) : (
                    <form onSubmit={handleMint} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Asset Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[#010402] border border-emerald-500/20 p-3 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                placeholder="e.g. Super Coin"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Ticker</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#010402] border border-emerald-500/20 p-3 text-emerald-50 focus:border-emerald-500 focus:outline-none uppercase font-mono"
                                    placeholder="e.g. SUP"
                                    value={formData.ticker}
                                    onChange={e => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Supply</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-[#010402] border border-emerald-500/20 p-3 text-emerald-50 focus:border-emerald-500 focus:outline-none font-mono"
                                    value={formData.supply}
                                    onChange={e => setFormData({ ...formData, supply: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex items-center justify-between text-xs text-emerald-500/50 mb-2 font-mono">
                                <span>MEME_POTENTIAL</span>
                                <span>HIGH_RISK</span>
                            </div>
                            <div className="h-1 bg-emerald-900/30 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 w-3/4 animate-pulse"></div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={status === 'minting'}
                            fullWidth
                            variant="primary"
                        >
                            INITIALIZE SEQ
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};
