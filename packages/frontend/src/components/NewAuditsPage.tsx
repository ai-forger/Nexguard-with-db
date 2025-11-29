import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { Card, Badge } from './CyberTheme';
import { API } from '../services/api';

export const AuditsPage = () => {
    const [audits, setAudits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const data = await API.getAudits();
                setAudits(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAudits();
    }, []);

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'MINT': return <Badge type="success" text="MINT" />;
            case 'RISK_ANALYSIS': return <Badge type="privacy" text="RISK_ANALYSIS" />;
            case 'TRADE': return <Badge type="neutral" text="TRADE" />;
            case 'REPORT': return <Badge type="neutral" text="REPORT" />;
            default: return <Badge type="neutral" text={action} />;
        }
    };

    const filteredAudits = audits.filter(a =>
        a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-8 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-emerald-500/20 pb-4">
                    <h2 className="text-xl font-brand font-bold text-white tracking-wider flex items-center gap-2">
                        SYSTEM AUDIT LOG
                    </h2>

                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-2.5 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="SEARCH LOGS..."
                            className="w-full bg-[#050806] border border-emerald-500/20 rounded-sm py-2 pl-10 pr-4 text-xs font-mono text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all uppercase placeholder-emerald-900"
                        />
                    </div>
                </div>

                {/* Table Card */}
                <Card className="p-0 overflow-hidden border-emerald-500/30 bg-[#050806]/80 min-h-[500px]">

                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 p-4 border-b border-emerald-500/20 bg-emerald-900/5 text-xs font-mono text-emerald-500/70 uppercase tracking-widest">
                        <div>TIME</div>
                        <div>ACTION</div>
                        <div>ACTOR</div>
                        <div>STATUS</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-emerald-500/10">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="grid grid-cols-4 gap-4 p-4 animate-pulse">
                                    <div className="h-4 bg-emerald-900/20 rounded w-24"></div>
                                    <div className="h-4 bg-emerald-900/20 rounded w-20"></div>
                                    <div className="h-4 bg-emerald-900/20 rounded w-32"></div>
                                    <div className="h-4 bg-emerald-900/20 rounded w-16"></div>
                                </div>
                            ))
                        ) : filteredAudits.length > 0 ? (
                            filteredAudits.map((audit, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-emerald-500/5 transition-colors group">

                                    {/* Time */}
                                    <div className="text-sm font-mono text-emerald-500/60">
                                        {audit.time}
                                    </div>

                                    {/* Action */}
                                    <div>
                                        {getActionBadge(audit.action)}
                                    </div>

                                    {/* Actor */}
                                    <div className="text-sm font-bold text-white font-brand">
                                        {audit.user}
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                                        {audit.status === 'success' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400">
                                                <CheckCircle size={14} /> SUCCESS
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-red-500">
                                                <XCircle size={14} /> FAILED
                                            </span>
                                        )}
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-emerald-500/30 font-mono text-sm">
                                NO LOGS FOUND MATCHING QUERY.
                            </div>
                        )}
                    </div>

                </Card>

            </div>
        </div>
    );
};
