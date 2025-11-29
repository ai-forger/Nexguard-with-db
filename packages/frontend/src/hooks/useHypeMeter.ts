import { useState, useEffect } from 'react';
import axios from 'axios';

const HYPE_API_URL = 'http://localhost:8000'; // Python Service URL

export interface HypeData {
    status: string;
    ratio: number;
    risk_label: string;
    message: string;
    details: {
        avg_price_norm: number;
        avg_hype_norm: number;
        data_points: number;
    };
}

export interface HistoryData {
    timestamp: string;
    price: number;
    volume: number;
}

export const useHypeMeter = (tokenId: string) => {
    const [hypeData, setHypeData] = useState<HypeData | null>(null);
    const [history, setHistory] = useState<HistoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tokenId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch Meter Data
                const meterRes = await axios.get(`${HYPE_API_URL}/meter/${tokenId}`);
                setHypeData(meterRes.data);

                // Fetch History Data
                const historyRes = await axios.get(`${HYPE_API_URL}/history/${tokenId}`);
                setHistory(historyRes.data.history);

            } catch (err: any) {
                console.error("Hype Meter Error:", err);
                setError(err.response?.data?.detail || "Failed to fetch Hype Meter data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Poll every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);

    }, [tokenId]);

    return { hypeData, history, loading, error };
};
