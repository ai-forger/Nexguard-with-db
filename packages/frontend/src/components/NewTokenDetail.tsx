import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Terminal, Cpu, TrendingUp, AlertTriangle, Zap, Copy } from 'lucide-react';
import { Button, Card } from './CyberTheme';
import { API } from '../services/api';

const TrustGauge = ({ score }: { score: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx="50%" cy="50%" r={radius} stroke="#050806" strokeWidth="12" fill="transparent" />
                <circle cx="50%" cy="50%" r={radius} stroke="#10b981" strokeWidth="12" fill="transparent" strokeOpacity="0.1" />
                <circle
                    cx="50%" cy="50%" r={radius}
                    stroke={score > 80 ? '#10b981' : score > 50 ? '#eab308' : '#ef4444'}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-white font-brand">{score}</span>
                <span className="text-xs text-emerald-500/50 uppercase tracking-widest font-mono mt-1">Trust</span>
            </div>
        </div>
    );
};

export const TokenDetailPage = () => {
    const { policyId } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        let mounted = true;
        API.getTokenDetail(policyId || '').then(res => {
            if (mounted) {
                setData(res);
                setLoading(false);
            }
        }).catch(e => {
            console.error(e);
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, [policyId]);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        const res = await API.askMasumi(policyId || '');
        setAnalysis(res);
        setAnalyzing(false);
    };

    if (loading) return <div className="p-10 text-center text-emerald-500 font-mono animate-pulse">ESTABLISHING SECURE UPLINK...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 font-mono">TOKEN NOT FOUND</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#050806] border border-emerald-500/30 flex items-center justify-center text-2xl font-bold text-emerald-400 font-brand">
                        {data.symbol[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white font-brand">{data.name} <span className="text-emerald-500/50 text-lg">({data.symbol})</span></h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-emerald-500/50 bg-[#050806] px-2 py-1 border border-emerald-500/10">{policyId}</span>
                            <button className="text-emerald-500/50 hover:text-emerald-400 transition-colors"><Copy size={14} /></button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="text-xs">WATCHLIST</Button>
                    <Button variant="primary" className="text-xs">TRADE {data.symbol}</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <Card className="flex flex-col items-center justify-center py-8">
                    <h3 className="w-full text-left font-bold text-emerald-500/70 mb-4 flex items-center gap-2 font-brand uppercase tracking-wider text-sm">
                        <ShieldAlert size={16} /> Safety Score
                    </h3>
                    <TrustGauge score={data.trustScore} />
                    <div className="mt-6 text-center space-y-1 font-mono">
                        <p className="text-xs text-emerald-500/50 uppercase">Community Verdict</p>
                        <div className="flex items-center justify-center gap-2 text-xs">
                            <span className="text-emerald-400">92% SAFE</span>
                            <span className="text-emerald-900">|</span>
                            <span className="text-red-400">8% SUSPICIOUS</span>
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-emerald-500"></div>
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 font-brand uppercase tracking-wider text-sm">
                        <Terminal size={16} className="text-emerald-400" /> Masumi Risk Copilot
                    </h3>

                    <div className="bg-[#010402] p-4 font-mono text-xs h-48 overflow-y-auto mb-4 border border-emerald-500/20 shadow-inner">
                        {!analysis && !analyzing && (
                            <div className="text-emerald-500/30 h-full flex flex-col items-center justify-center text-center">
                                <Cpu size={24} className="mb-2 opacity-50" />
                                <p>AI NEURAL LINK STANDBY.</p>
                                <p>READY TO ANALYZE HEURISTICS.</p>
                            </div>
                        )}
                        {analyzing && (
                            <div className="space-y-2">
                                <div className="flex gap-2 text-emerald-400">
                                    <span>&gt;</span>
                                    <span className="animate-pulse">Scanning bytecode...</span>
                                </div>
                                <div className="flex gap-2 text-emerald-500 delay-75">
                                    <span>&gt;</span>
                                    <span className="animate-pulse delay-100">Checking liquidity locks...</span>
                                </div>
                                <div className="flex gap-2 text-emerald-600 delay-150">
                                    <span>&gt;</span>
                                    <span className="animate-pulse delay-200">Verifying permissions...</span>
                                </div>
                            </div>
                        )}
                        {analysis && (
                            <div className="text-emerald-100 animate-in fade-in">
                                <span className="text-emerald-400 font-bold">&gt; ANALYSIS COMPLETE</span>
                                <br /><br />
                                {analysis.explanation}
                                <br /><br />
                                <span className="text-emerald-500/50">HASH: {data.decisionHash}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        fullWidth
                        onClick={handleAnalyze}
                        variant={analysis ? "secondary" : "primary"}
                        disabled={analyzing}
                    >
                        {analysis ? "RE-RUN ANALYSIS" : "ANALYZE RISK"}
                    </Button>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold text-emerald-500/70 mb-4 font-brand uppercase tracking-wider text-sm">Community Actions</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Button variant="success" className="h-24 flex-col gap-1 border-emerald-500/20 hover:border-emerald-500">
                                <TrendingUp size={24} />
                                <span>LEGIT</span>
                            </Button>
                            <Button variant="danger" className="h-24 flex-col gap-1">
                                <AlertTriangle size={24} />
                                <span>SCAM</span>
                            </Button>
                        </div>
                        <Button variant="secondary" fullWidth className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500">
                            <span className="flex items-center gap-2"><Zap size={16} /> REPORT ANOMALY</span>
                        </Button>
                    </Card>

                    <Card className="border-yellow-500/20">
                        <h3 className="font-bold text-yellow-500 mb-2 text-xs uppercase tracking-wide font-brand">On-Chain Verification</h3>
                        <p className="text-xs text-emerald-500/50 mb-4 font-mono">Publish risk assessment to Cardano blockchain.</p>
                        <Button variant="secondary" fullWidth className="text-xs py-2 border-yellow-500/30 text-yellow-500 hover:border-yellow-500 hover:bg-yellow-500/10">PUBLISH (5 ADA)</Button>
                    </Card>
                </div>

            </div>
        </div>
    );
};
