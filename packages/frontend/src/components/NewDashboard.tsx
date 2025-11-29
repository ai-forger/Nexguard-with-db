import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Radio, TrendingUp, AlertTriangle, CheckCircle, Clock, Flag, ChevronRight } from 'lucide-react';
import { Button, Badge, Card } from './CyberTheme';
import { API } from '../services/api';

export const Dashboard = () => {
    const [tokens, setTokens] = useState<any[]>([]);
    const [memecoins, setMemecoins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            try {
                const [tData, mData] = await Promise.all([API.getTokens(), API.getMemecoins()]);
                if (mounted) {
                    setTokens(tData);
                    setMemecoins(mData);
                    setLoading(false);
                }
            } catch (e) {
                console.error("Failed to load dashboard data", e);
                if (mounted) setLoading(false);
            }
        };
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative overflow-hidden border border-emerald-500/20 p-8 sm:p-12 bg-[#050806]">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Activity size={120} className="text-emerald-500" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-brand font-bold text-white mb-2 tracking-wide">
                        WELCOME TO THE <span className="text-emerald-400">VOID</span>
                    </h1>
                    <p className="text-emerald-500/60 mb-8 font-mono max-w-lg leading-relaxed">
                        Monitor real-time heuristics, mint secure assets, and simulate swaps in a protected sandbox environment.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/app/explorer">
                            <Button variant="primary">SYSTEM STATUS</Button>
                        </Link>
                        <Link to="/app/mint">
                            <Button variant="secondary">CREATE ASSET</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-brand font-bold text-white flex items-center gap-2">
                                <Radio className="text-emerald-500 animate-pulse" size={20} /> LIVE TOKEN FEED
                            </h2>
                            <span className="text-emerald-500/40 text-xs font-mono ml-7">Real-time meme coin detection</span>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-28 bg-emerald-900/10 border border-emerald-500/10 animate-pulse rounded-xl" />)
                        ) : (
                            tokens.map(token => (
                                <Link key={token.id} to={`/app/token/${token.id}`}>
                                    <div className="relative overflow-hidden bg-[#080a0c] border border-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 rounded-xl p-4 sm:p-5 flex items-center justify-between group">

                                        {/* Left Side: Info */}
                                        <div className="flex flex-col gap-2.5">
                                            {/* Row 1: Name & Symbol & Latest */}
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <h3 className="font-brand font-bold text-lg text-white truncate max-w-[100px] sm:max-w-[150px]">{token.name}</h3>
                                                <span className="font-mono text-emerald-500/40 text-sm">({token.symbol})</span>
                                                {token.isLatest && <Badge type="latest" text="LATEST" />}
                                            </div>

                                            {/* Row 2: Risk Badge */}
                                            <div className="flex items-center">
                                                <Badge
                                                    type={token.score < 50 ? 'danger' : 'success'}
                                                    icon={token.score < 50 ? AlertTriangle : CheckCircle}
                                                    text={token.score < 50 ? 'RISKY' : 'SAFE'}
                                                />
                                            </div>

                                            {/* Row 3: Time & Flags */}
                                            <div className="flex items-center gap-3 text-xs font-mono text-emerald-500/40 mt-1">
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {token.timestamp}</span>
                                                {token.flags > 0 && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-red-500/30 text-red-400 bg-red-500/10">
                                                        <Flag size={10} /> {token.flags} flags
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Score & Action */}
                                        <div className="flex items-center gap-4">
                                            {/* Score Box */}
                                            <div className={`
                                                flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition-all duration-500 bg-[#050806]
                                                ${token.score < 50 ? 'border-red-500 text-red-500 score-glow-red' : 'border-emerald-500 text-emerald-400 score-glow-green'}
                                            `}>
                                                <span className="text-3xl font-brand font-bold leading-none mt-1">{token.score}</span>
                                                <span className="text-[10px] font-mono opacity-60 mt-1">/ 100</span>
                                            </div>

                                            {/* Analyze Button */}
                                            <div className="hidden sm:block">
                                                <Button variant="primary" className="h-10 px-6 text-xs shadow-lg shadow-emerald-500/20">Analyze</Button>
                                            </div>
                                        </div>

                                        {/* Mobile Chevron */}
                                        <div className="sm:hidden absolute right-2 top-2">
                                            <ChevronRight className="text-emerald-500/30" size={16} />
                                        </div>

                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                        <TrendingUp className="text-emerald-400" size={20} />
                        <h2 className="text-xl font-brand font-bold text-white">TRENDING</h2>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-24 bg-emerald-900/10 animate-pulse" />)
                        ) : (
                            memecoins.map(coin => (
                                <Card
                                    key={coin.id}
                                    className={`p-4 border-l-4 ${coin.trust > 80 ? 'border-l-emerald-500' : coin.trust > 50 ? 'border-l-yellow-500' : 'border-l-red-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-white font-brand">{coin.name}</span>
                                        <Badge
                                            type={coin.trust > 80 ? 'success' : coin.trust > 50 ? 'warning' : 'danger'}
                                            text={`TRUST: ${coin.trust}`}
                                        />
                                    </div>
                                    <div className="w-full bg-emerald-900/20 h-1 mt-2">
                                        <div
                                            className={`h-full ${coin.trust > 80 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${coin.trust}%` }}
                                        />
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
