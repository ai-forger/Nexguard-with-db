import React from 'react';
import { ShieldAlert, LogOut, Menu, X, LayoutDashboard, PlusCircle, ArrowRightLeft, Fingerprint, FileText, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Oxanium:wght@400;500;600;700&display=swap');

    :root {
      --color-void: #010402;
      --color-card-bg: #050806;
      --color-emerald-500: #10b981;
      --color-emerald-400: #34d399;
      --color-phosphor: #d1fae5;
      --color-purple-500: #8b5cf6;
      --color-blue-500: #3b82f6;
    }

    body {
      background-color: var(--color-void);
      color: var(--color-phosphor);
      font-family: 'JetBrains Mono', monospace;
    }

    .font-brand { font-family: 'Oxanium', display; }
    
    .cyber-grid {
      background-size: 50px 50px;
      background-image:
        linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
      mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 100%);
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 0;
    }

    .scanline {
      width: 100%;
      height: 100px;
      z-index: 10;
      background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(16, 185, 129, 0.02) 50%, rgba(0,0,0,0) 100%);
      opacity: 0.1;
      position: absolute;
      bottom: 100%;
      animation: scanline 10s linear infinite;
      pointer-events: none;
    }

    @keyframes scanline {
      0% { bottom: 100%; }
      100% { bottom: -100px; }
    }

    .hud-card {
      position: relative;
      background: rgba(5, 8, 6, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .hud-card::before {
      content: '';
      position: absolute;
      top: -1px; left: -1px;
      width: 8px; height: 8px;
      border-top: 2px solid var(--color-emerald-500);
      border-left: 2px solid var(--color-emerald-500);
    }
    .hud-card::after {
      content: '';
      position: absolute;
      bottom: -1px; right: -1px;
      width: 8px; height: 8px;
      border-bottom: 2px solid var(--color-emerald-500);
      border-right: 2px solid var(--color-emerald-500);
    }

    .hud-card.privacy-mode { border-color: rgba(139, 92, 246, 0.3); }
    .hud-card.privacy-mode::before { border-color: var(--color-purple-500); }
    .hud-card.privacy-mode::after { border-color: var(--color-purple-500); }

    .glitch-text { position: relative; }
    .glitch-text::before, .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: var(--color-void);
    }
    .glitch-text::before {
      left: 2px; text-shadow: -1px 0 #ff00c1;
      clip-path: inset(44% 0 61% 0);
      animation: glitch-anim 2s infinite linear alternate-reverse;
    }
    .glitch-text::after {
      left: -2px; text-shadow: -1px 0 #00fff9;
      clip-path: inset(58% 0 43% 0);
      animation: glitch-anim 2s infinite linear alternate-reverse;
      animation-delay: 1s;
    }

    @keyframes glitch-anim {
      0% { clip-path: inset(40% 0 61% 0); }
      20% { clip-path: inset(92% 0 1% 0); }
      40% { clip-path: inset(43% 0 1% 0); }
      60% { clip-path: inset(25% 0 58% 0); }
      80% { clip-path: inset(54% 0 7% 0); }
      100% { clip-path: inset(58% 0 43% 0); }
    }
    
    .score-glow-red { box-shadow: 0 0 15px rgba(239, 68, 68, 0.2), inset 0 0 10px rgba(239, 68, 68, 0.1); }
    .score-glow-green { box-shadow: 0 0 15px rgba(16, 185, 129, 0.2), inset 0 0 10px rgba(16, 185, 129, 0.1); }
  `}</style>
);

// --- CARDANO LOGO & PARTICLE SYSTEM ---

// Generate Cardano Logo Coordinates
const getCardanoDots = (centerX: number, centerY: number, scale: number) => {
    const dots: { x: number, y: number, r: number }[] = [];
    // Center
    dots.push({ x: centerX, y: centerY, r: 12 * scale });

    // Rings
    const rings = [
        { count: 6, radius: 40 * scale, size: 8 * scale },
        { count: 6, radius: 70 * scale, size: 10 * scale, offset: Math.PI / 6 },
        { count: 6, radius: 100 * scale, size: 6 * scale }
    ];

    rings.forEach(ring => {
        for (let i = 0; i < ring.count; i++) {
            const angle = (i * 2 * Math.PI / ring.count) + (ring.offset || 0);
            dots.push({
                x: centerX + Math.cos(angle) * ring.radius,
                y: centerY + Math.sin(angle) * ring.radius,
                r: ring.size
            });
        }
    });
    return dots;
};

export const CardanoLogo = ({ className = "", size = 120, hidden = false }: { className?: string, size?: number, hidden?: boolean }) => {
    const dots = getCardanoDots(size / 2, size / 2, size / 250);

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`transition-opacity duration-200 ${className}`}
            style={{ opacity: hidden ? 0 : 1 }}
        >
            {dots.map((dot, i) => (
                <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.r}
                    fill="#3b82f6"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </svg>
    );
};

// Particle Explosion Logic
export const ExplosionCanvas = ({ active, onComplete, size = 120 }: { active: boolean, onComplete: () => void, size?: number }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const requestRef = React.useRef<number>(0); // Initialize with 0

    React.useEffect(() => {
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize Particles based on Cardano Dots
        const baseDots = getCardanoDots(size / 2, size / 2, size / 250);
        let particles: any[] = [];

        baseDots.forEach(dot => {
            // Create cluster of particles for each logo dot to simulate "ash"
            const particleCount = 15;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: dot.x + (Math.random() - 0.5) * dot.r, // Jitter
                    y: dot.y + (Math.random() - 0.5) * dot.r,
                    vx: (Math.random() - 0.5) * 8, // Explosive velocity
                    vy: (Math.random() - 0.5) * 8,
                    life: 1.0,
                    decay: 0.01 + Math.random() * 0.03,
                    color: Math.random() > 0.5 ? '#3b82f6' : '#ffffff', // Blue and White ash
                    size: Math.random() * 2 + 1
                });
            }
        });

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let aliveParticles = 0;

            particles.forEach(p => {
                if (p.life > 0) {
                    aliveParticles++;
                    // Physics
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.96; // Friction
                    p.vy *= 0.96;
                    p.life -= p.decay;

                    // Render
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            if (aliveParticles > 0) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [active, onComplete, size]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-50"
        />
    );
};

export const Card = ({ children, className = "", privacyMode = false }: { children: React.ReactNode, className?: string, privacyMode?: boolean }) => (
    <div className={`hud-card rounded-sm p-6 shadow-lg ${privacyMode ? 'privacy-mode' : ''} ${className}`}>
        {children}
    </div>
);

export const Badge = ({ type, text, icon: Icon }: { type: 'success' | 'warning' | 'danger' | 'neutral' | 'privacy' | 'latest', text: string, icon?: any }) => {
    const colors = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/10 text-red-400 border-red-500/30',
        neutral: 'bg-emerald-900/20 text-emerald-200/50 border-emerald-500/10',
        privacy: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        latest: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-brand font-bold tracking-wider uppercase border rounded-sm ${colors[type]}`}>
            {Icon && <Icon size={10} />}
            {text}
        </span>
    );
};

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    isLoading = false,
    className = "",
    fullWidth = false,
    type = "button"
}: any) => {
    const baseStyle = "font-brand uppercase tracking-widest text-sm font-bold py-3 px-6 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed clip-path-slant";

    const variants = {
        primary: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
        secondary: "bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500",
        danger: "bg-red-900/20 border border-red-500/50 text-red-500 hover:bg-red-500/20",
        success: "bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20",
        privacy: "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]",
        ghost: "text-emerald-500/50 hover:text-emerald-400",
        blue: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${fullWidth ? 'w-full' : ''} ${className}`}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
        >
            {isLoading ? (
                <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    PROCESSING
                </>
            ) : children}
        </button>
    );
};

const SidebarItem = ({ icon: Icon, label, to, active }: any) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all mb-1 font-brand text-sm tracking-wide
      ${active
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                : 'border-transparent text-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-300'
            }`}
    >
        <Icon size={18} />
        <span className="font-medium">{label}</span>
    </Link>
);

export const DashboardLayout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'DASHBOARD', to: '/app' },
        { icon: PlusCircle, label: 'MINT ASSET', to: '/app/mint' },
        { icon: ArrowRightLeft, label: 'DEX SWAP', to: '/app/trade' },
        { icon: Fingerprint, label: 'PASSPORT', to: '/app/passport' },
        { icon: FileText, label: 'AUDIT LOGS', to: '/app/audits' },
        { icon: Activity, label: 'EXPLORER', to: '/app/explorer' },
    ];

    return (
        <div className="min-h-screen bg-[#010402] text-emerald-50 selection:bg-emerald-500/30 font-mono overflow-x-hidden">
            <GlobalStyles />
            <div className="cyber-grid"></div>

            <div className="lg:hidden flex items-center justify-between p-4 border-b border-emerald-500/20 bg-[#010402]/90 backdrop-blur sticky top-0 z-50">
                <div className="flex items-center gap-2 font-brand font-bold text-xl tracking-tighter text-white">
                    <ShieldAlert className="text-emerald-500" />
                    <span className="glitch-text" data-text="NEXGUARD">NEXGUARD</span>
                </div>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-emerald-500">
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex max-w-[1920px] mx-auto relative z-10">
                <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#050806] border-r border-emerald-500/20 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="flex flex-col h-full">
                        <div className="p-6">
                            <div className="flex items-center gap-2 font-brand font-bold text-2xl tracking-tighter text-white mb-2">
                                <ShieldAlert className="text-emerald-500" size={28} />
                                <span className="glitch-text" data-text="NEXGUARD">NEXGUARD</span>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                        </div>

                        <nav className="space-y-1 flex-1 px-2">
                            {navItems.map((item) => (
                                <SidebarItem
                                    key={item.to}
                                    {...item}
                                    active={location.pathname === item.to || (item.to !== '/app' && location.pathname.startsWith(item.to))}
                                />
                            ))}
                        </nav>

                        <div className="p-4 border-t border-emerald-500/20 bg-[#010402]/50">
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-none text-red-400 hover:bg-red-500/10 transition-colors w-full font-brand text-sm tracking-wide border border-transparent hover:border-red-500/30"
                            >
                                <LogOut size={18} />
                                <span className="font-bold">DISCONNECT</span>
                            </button>
                            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500/50 px-4 font-mono">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                SYSTEM ONLINE
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto relative">
                    <div className="scanline"></div>
                    {children}
                </main>
            </div>
        </div>
    );
};
