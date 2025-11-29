import { useState } from 'react';
import { User, Wallet, Shield, Fingerprint } from 'lucide-react';
import { Card, Button, Badge } from './CyberTheme';
import { API } from '../services/api';

export const PassportPage = () => {
    const [hasIdentity, setHasIdentity] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventory] = useState([
        { symbol: 'ADA', balance: 1420 },
        { symbol: 'EMPTY', balance: 0 },
        { symbol: 'EMPTY', balance: 0 },
        { symbol: 'EMPTY', balance: 0 },
        { symbol: 'EMPTY', balance: 0 },
        { symbol: 'EMPTY', balance: 0 },
    ]);

    const handleGenerateIdentity = async () => {
        setLoading(true);
        try {
            await API.generateIdentity();
            setHasIdentity(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                {/* LEFT COLUMN: DIGITAL PASSPORT */}
                <div className="space-y-4">
                    <h2 className="text-xl font-brand font-bold text-white tracking-wider flex items-center gap-2">
                        DIGITAL PASSPORT
                    </h2>

                    <Card className={`h-96 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${hasIdentity ? 'border-emerald-500/50' : 'border-purple-500/30'}`} privacyMode={!hasIdentity}>

                        {!hasIdentity ? (
                            <>
                                <div className="absolute inset-0 bg-purple-500/5 blur-[50px]"></div>
                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-[#010402] border-2 border-purple-500/30 flex items-center justify-center">
                                        <User size={48} className="text-purple-500/50" />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-purple-200/50 font-mono text-sm tracking-widest">NO ACTIVE IDENTITY DETECTED.</p>
                                    </div>

                                    <Button
                                        variant="privacy"
                                        onClick={handleGenerateIdentity}
                                        isLoading={loading}
                                        className="px-8 py-4 text-sm shadow-lg shadow-purple-500/20"
                                    >
                                        <Fingerprint size={18} /> GENERATE IDENTITY
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-emerald-500/5 blur-[50px]"></div>
                                <div className="relative z-10 w-full px-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="text-left">
                                            <h3 className="text-2xl font-brand font-bold text-white">NEO_OPERATOR</h3>
                                            <p className="text-emerald-500/50 font-mono text-xs">ID: 8F92...99A1</p>
                                        </div>
                                        <Badge type="success" text="VERIFIED" icon={Shield} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="p-4 bg-[#010402] border border-emerald-500/20 rounded">
                                            <p className="text-xs text-emerald-500/50 mb-1">CLEARANCE</p>
                                            <p className="font-brand text-emerald-400">LEVEL 5</p>
                                        </div>
                                        <div className="p-4 bg-[#010402] border border-emerald-500/20 rounded">
                                            <p className="text-xs text-emerald-500/50 mb-1">REPUTATION</p>
                                            <p className="font-brand text-emerald-400">98/100</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </div>

                {/* RIGHT COLUMN: INVENTORY */}
                <div className="space-y-4">
                    <h2 className="text-xl font-brand font-bold text-white tracking-wider flex items-center gap-2">
                        INVENTORY
                    </h2>

                    <Card className="h-96 p-0 border-emerald-500/30 bg-[#050806]/80">
                        <div className="p-4 border-b border-emerald-500/20">
                            <div className="flex items-center gap-2 text-emerald-500/70 font-mono text-xs uppercase tracking-widest">
                                <Wallet size={14} /> CONNECTED ASSETS
                            </div>
                        </div>

                        <div className="grid grid-cols-3 grid-rows-2 h-[calc(100%-50px)]">
                            {inventory.map((item, i) => (
                                <div
                                    key={i}
                                    className={`
                                        border-r border-b border-emerald-500/10 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-emerald-500/5
                                        ${(i + 1) % 3 === 0 ? 'border-r-0' : ''}
                                        ${i >= 3 ? 'border-b-0' : ''}
                                    `}
                                >
                                    {item.symbol !== 'EMPTY' ? (
                                        <>
                                            <span className="font-brand font-bold text-white text-lg">{item.symbol}</span>
                                            <span className="font-mono text-emerald-500 text-xs">{item.balance}</span>
                                        </>
                                    ) : (
                                        <span className="font-mono text-emerald-500/20 text-[10px]">EMPTY</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
