import { useHypeMeter } from '../hooks/useHypeMeter';
import { Card } from './CyberTheme';
import { Activity, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

export const HypeMeterWidget = ({ tokenId }: { tokenId: string }) => {
    const { hypeData, loading, error } = useHypeMeter(tokenId);

    if (loading) {
        return (
            <Card className="animate-pulse border-emerald-500/20">
                <div className="h-24 flex flex-col items-center justify-center text-emerald-500/50 font-mono text-xs">
                    <Activity className="animate-spin mb-2" />
                    CALCULATING HYPE RATIO...
                </div>
            </Card>
        );
    }

    if (error || !hypeData) {
        return (
            <Card className="border-red-500/20">
                <div className="h-24 flex flex-col items-center justify-center text-red-500/50 font-mono text-xs">
                    <AlertTriangle className="mb-2" />
                    METRICS UNAVAILABLE
                </div>
            </Card>
        );
    }

    const { risk_label, ratio, message } = hypeData;

    let colorClass = "text-emerald-500";
    let Icon = HelpCircle;
    let borderColor = "border-emerald-500/20";

    if (risk_label === "Clown Energy") {
        colorClass = "text-red-500";
        Icon = AlertTriangle;
        borderColor = "border-red-500/50";
    } else if (risk_label === "Whale Accumulation") {
        colorClass = "text-blue-400";
        Icon = TrendingUp;
        borderColor = "border-blue-500/50";
    }

    return (
        <Card className={`${borderColor} relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${risk_label === "Clown Energy" ? "bg-red-500" : risk_label === "Whale Accumulation" ? "bg-blue-500" : "bg-emerald-500"}`}></div>

            <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white font-brand uppercase tracking-wider text-sm flex items-center gap-2">
                    <Icon size={16} className={colorClass} />
                    Hype Meter
                </h3>
                <span className={`text-xs font-mono px-2 py-0.5 border ${borderColor} ${colorClass} bg-black/50`}>
                    RATIO: {ratio.toFixed(2)}
                </span>
            </div>

            <div className="text-center py-4">
                <h2 className={`text-2xl font-bold ${colorClass} font-brand uppercase mb-1`}>{risk_label}</h2>
                <p className="text-xs text-emerald-500/50 font-mono">{message}</p>
            </div>

            <div className="mt-2 pt-2 border-t border-emerald-500/10 flex justify-between text-[10px] font-mono text-emerald-500/30 uppercase">
                <span>Social: {hypeData.details.avg_hype_norm.toFixed(2)}</span>
                <span>Price: {hypeData.details.avg_price_norm.toFixed(2)}</span>
            </div>
        </Card>
    );
};
