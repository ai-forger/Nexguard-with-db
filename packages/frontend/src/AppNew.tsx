import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { DashboardLayout, GlobalStyles, Card, Button, CardanoLogo, ExplosionCanvas } from './components/CyberTheme';
import { Dashboard } from './components/NewDashboard';
import { MintPage } from './components/NewMintPage';
import { TokenDetailPage } from './components/NewTokenDetail';
import { ShieldAlert, Mail, Lock, ArrowRight, User, UserPlus } from 'lucide-react';
import { API } from './services/api';

import { TradePage } from './components/NewTradePage';
// Placeholder components for other pages
// const TradePage = () => <div className="p-10 text-white">Trade Page (Coming Soon)</div>;
import { PassportPage } from './components/NewPassportPage';
// const PassportPage = () => <div className="p-10 text-white">Passport Page (Coming Soon)</div>;
import { AuditsPage } from './components/NewAuditsPage';
// const AuditsPage = () => <div className="p-10 text-white">Audits Page (Coming Soon)</div>;
import { ExplorerPage } from './components/NewExplorerPage';
// const ExplorerPage = () => <div className="p-10 text-white">Explorer Page (Coming Soon)</div>;

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [exploding, setExploding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Trigger Explosion
        setExploding(true);
    };

    const handleExplosionComplete = async () => {
        await API.login({ email, password });
        setLoading(false);
        onLogin();
    };

    return (
        <div className="min-h-screen bg-[#010402] flex items-center justify-center p-4 relative overflow-hidden">
            <GlobalStyles />
            <div className="cyber-grid"></div>

            {/* Ambience */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">

                {/* LOGO SECTION WITH EXPLOSION */}
                <div className="text-center mb-8 relative">
                    <div className="relative h-32 w-32 mx-auto mb-4">
                        <CardanoLogo size={128} hidden={exploding} />
                        <ExplosionCanvas active={exploding} onComplete={handleExplosionComplete} size={128} />
                    </div>

                    <div className="flex items-center justify-center gap-3 font-brand font-bold text-4xl tracking-tighter text-white mb-2" data-text="NEXGUARD">
                        <ShieldAlert className="text-emerald-500" size={36} />
                        <span className="glitch-text text-emerald-50" data-text="NEXGUARD">NEXGUARD</span>
                    </div>
                    <p className="text-emerald-500/50 font-mono text-sm tracking-widest">SECURE ACCESS TERMINAL_v2.0</p>
                </div>

                <Card className="border-t-4 border-t-emerald-500">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Operator ID</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#010402] border border-emerald-500/20 rounded-none py-2.5 pl-10 pr-4 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                    placeholder="operator@nexguard.io"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Passcode</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#010402] border border-emerald-500/20 rounded-none py-2.5 pl-10 pr-4 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary" fullWidth isLoading={loading} className="group mt-6">
                            <span className="group-hover:mr-2 transition-all">AUTHENTICATE</span>
                            <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all absolute right-4" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs font-mono">
                        <span className="text-emerald-500/40">NO CLEARANCE? </span>
                        <Link to="/register" className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline">MINT IDENTITY</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const RegisterPage = ({ onRegister }: { onRegister: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [exploding, setExploding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setExploding(true);
    };

    const handleExplosionComplete = async () => {
        await API.register(formData);
        setLoading(false);
        onRegister();
    };

    return (
        <div className="min-h-screen bg-[#010402] flex items-center justify-center p-4 relative overflow-hidden">
            <GlobalStyles />
            <div className="cyber-grid"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">

                {/* LOGO SECTION WITH EXPLOSION */}
                <div className="text-center mb-8 relative">
                    <div className="relative h-32 w-32 mx-auto mb-4">
                        <CardanoLogo size={128} hidden={exploding} />
                        <ExplosionCanvas active={exploding} onComplete={handleExplosionComplete} size={128} />
                    </div>

                    <h1 className="text-3xl font-brand font-bold text-white mb-2 tracking-widest">INITIALIZE</h1>
                    <p className="text-emerald-500/50 font-mono text-xs">JOIN THE DECENTRALIZED GRID</p>
                </div>

                <Card className="border-t-4 border-t-emerald-500">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Username</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-[#010402] border border-emerald-500/20 rounded-none py-2.5 pl-10 pr-4 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                    placeholder="Degen_001"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#010402] border border-emerald-500/20 rounded-none py-2.5 pl-10 pr-4 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                    placeholder="you@domain.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest font-brand">Passcode</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#010402] border border-emerald-500/20 rounded-none py-2.5 pl-10 pr-4 text-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
                                <UserPlus size={18} /> CREATE IDENTITY
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs font-mono">
                        <span className="text-emerald-500/40">ALREADY VERIFIED? </span>
                        <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline">ACCESS TERMINAL</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/app" replace /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/app" replace /> : <RegisterPage onRegister={() => setIsAuthenticated(true)} />
                } />

                <Route path="/app/*" element={
                    isAuthenticated ? (
                        <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="mint" element={<MintPage />} />
                                <Route path="token/:policyId" element={<TokenDetailPage />} />
                                <Route path="trade" element={<TradePage />} />
                                <Route path="passport" element={<PassportPage />} />
                                <Route path="audits" element={<AuditsPage />} />
                                <Route path="explorer" element={<ExplorerPage />} />
                                <Route path="*" element={<Navigate to="/app" replace />} />
                            </Routes>
                        </DashboardLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />

                <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
        </Router>
    );
}
