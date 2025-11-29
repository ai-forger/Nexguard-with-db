import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { Suspense, lazy, useState, useEffect, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import axios from 'axios';
import API_URL from './apiConfig';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null; errorInfo: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#060608] text-white px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h1>
            <p className="text-gray-400 mb-4">{this.state.error?.message || 'Unknown error'}</p>
            {this.state.errorInfo && (
              <details className="text-left text-xs text-gray-500 bg-gray-900 p-4 rounded mb-4 max-h-60 overflow-auto">
                <summary className="cursor-pointer mb-2 text-gray-400">Error Details</summary>
                <pre>{this.state.error?.stack}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-neon text-black rounded-lg font-bold hover:bg-neon/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy Load Components
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./Home'));
const MemePassport = lazy(() => import('./components/MemePassport'));
const TradePage = lazy(() => import('./pages/TradePage'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#060608] text-neon">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
      <span className="font-heading tracking-widest">LOADING NEXGUARD...</span>
    </div>
  </div>
);

// Mock Pages for now
import { useWallet } from './context/WalletContext';

const MintPage = () => {
  const { address, walletApi } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState<any>(null);
  const [signing, setSigning] = useState(false);

  const handleMint = async () => {
    if (!address) {
      alert('Please connect your wallet first to mint tokens');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/simulate/mint`, {
        name,
        symbol,
        creator: address
      });
      setResult(res.data);

      // Note: Wallet signing removed to avoid CBOR deserialization errors
      // In production, this would use a properly formatted transaction
    } catch (err) {
      console.error('Mint error:', err);
      alert("Mint failed. Please check the console for details.");
    }
  };

  const handleSignTransaction = async (tokenId: string) => {
    if (!walletApi) return;

    setSigning(true);
    try {
      const dummyTxHex = '84a400818258200000000000000000000000000000000000000000000000000000000000000000000182825839000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a000f4240a0f5f6';

      console.log('Requesting transaction signature...');
      const signedTx = await walletApi.signTx(dummyTxHex, false);
      console.log('Transaction signed:', signedTx);

      alert('✅ Demo transaction signed successfully!\n\nIn a real app, this would be submitted to the blockchain.');
    } catch (error: any) {
      console.error('Signing failed:', error);
      if (error.code === 2) {
        alert('Transaction signing was cancelled by user');
      } else {
        alert(`Signing failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Token Launchpad</h1>
          <p className="text-gray-400 text-lg">Simulate minting tokens on Cardano testnet</p>
        </div>

        {!address && (
          <div className="mb-6 p-5 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-l-4 border-yellow-500 rounded-r-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-200 font-medium">Connect your wallet to start minting</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mint Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Token
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Token Name</label>
                <input
                  className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g., My Awesome Token"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!address}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Symbol</label>
                <input
                  className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase"
                  placeholder="e.g., MAT"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                  disabled={!address}
                  maxLength={5}
                />
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                onClick={handleMint}
                disabled={!address || signing || !name || !symbol}
              >
                {signing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing Transaction...
                  </span>
                ) : address ? 'Launch Token' : 'Connect Wallet First'}
              </button>
            </div>
          </div>

          {/* Success Result or Guide */}
          {result ? (
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-400">Token Created!</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Token ID</p>
                  <p className="text-white font-mono text-sm break-all">{result.tokenId}</p>
                </div>

                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Trust Score</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${result.trust_score}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-bold text-lg">{result.trust_score}/100</span>
                  </div>
                </div>

                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Creator</p>
                  <p className="text-gray-300 font-mono text-sm">{address?.slice(0, 20)}...{address?.slice(-12)}</p>
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Mint Another Token
              </button>
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">1</div>
                  <div>
                    <p className="font-semibold text-white mb-1">Connect Wallet</p>
                    <p className="text-sm">Link your Cardano wallet to sign transactions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">2</div>
                  <div>
                    <p className="font-semibold text-white mb-1">Enter Details</p>
                    <p className="text-sm">Provide a name and symbol for your token</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">3</div>
                  <div>
                    <p className="font-semibold text-white mb-1">Sign Transaction</p>
                    <p className="text-sm">Approve the demo transaction in your wallet</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">4</div>
                  <div>
                    <p className="font-semibold text-white mb-1">Token Created</p>
                    <p className="text-sm">Your token is simulated and ready to test</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PassportPage = () => {
  const { address } = useWallet();
  const [identity, setIdentity] = useState<any>(null);
  const [seed, setSeed] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const useSeed = seed || address || '';
      const res = await axios.post(`${API_URL}/generate-meme-identity`, { seed: useSeed });
      setIdentity(res.data);
    } catch (err) {
      alert('Failed to generate identity');
    } finally {
      setGenerating(false);
    }
  };

  if (identity) {
    return <MemePassport identity={identity} onContinue={() => setIdentity(null)} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Meme Passport</h1>
          <p className="text-gray-400 text-xl">Generate your unique crypto identity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Form */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Identity</h2>
              <p className="text-gray-400 text-sm">AI-powered personality based on your wallet</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Seed (optional)</label>
                <input
                  className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder={address ? `Using: ${address.slice(0, 12)}...` : "Enter custom seed or connect wallet"}
                  value={seed}
                  onChange={e => setSeed(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {address ? 'Your wallet address will be used if seed is empty' : 'Connect wallet for deterministic identity'}
                </p>
              </div>

              <button
                onClick={generate}
                disabled={generating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Passport'}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">AI-Generated</h3>
                  <p className="text-sm text-gray-400">Powered by advanced AI</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Deterministic</h3>
                  <p className="text-sm text-gray-400">Same seed = same identity</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Unique Personality</h3>
                  <p className="text-sm text-gray-400">Custom traits & astrology</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">👤</div>
              <h4 className="font-semibold text-white mb-1">Username</h4>
              <p className="text-sm text-gray-400">A unique meme-worthy name</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-semibold text-white mb-1">Astrology</h4>
              <p className="text-sm text-gray-400">Your crypto zodiac sign</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-white mb-1">Traits</h4>
              <p className="text-sm text-gray-400">Personality characteristics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditsPage = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/audits`);
      setAudits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAudits = audits.filter(audit => {
    if (filter === 'all') return true;
    return audit.action === filter;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'MINT': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'WHISTLEBLOWER_REPORT': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'PUBLISH': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'MINT':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'WHISTLEBLOWER_REPORT':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'PUBLISH':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Audit Trail</h1>
          <p className="text-gray-400 text-lg">Complete history of all platform activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Total Audits</span>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-white">{audits.length}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Mints</span>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {audits.filter(a => a.action === 'MINT').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Reports</span>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {audits.filter(a => a.action === 'WHISTLEBLOWER_REPORT').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Published</span>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {audits.filter(a => a.action === 'PUBLISH').length}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'MINT', 'WHISTLEBLOWER_REPORT', 'PUBLISH'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {f === 'all' ? 'All Events' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Audit List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400">Loading audit logs...</p>
            </div>
          ) : filteredAudits.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No audit logs found</p>
              <p className="text-gray-500 text-sm mt-2">Activity will appear here once actions are performed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredAudits.map((audit, i) => (
                <div key={i} className="p-5 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${getActionColor(audit.action)}`}>
                      {getActionIcon(audit.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{audit.action.replace('_', ' ')}</h3>
                          <p className="text-gray-400 text-sm mt-1">{audit.info || 'No additional information'}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {audit.timestamp ? new Date(audit.timestamp).toLocaleString() : 'Unknown time'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          Actor: <span className="text-gray-300 font-mono">{audit.actor || 'system'}</span>
                        </span>
                        {audit.tokenId && (
                          <span className="text-gray-500">
                            Token: <span className="text-blue-400 font-mono">{audit.tokenId}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <WalletProvider>
          <AuthProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Website Routes */}
                  <Route path="/" element={
                    <>
                      <Header />
                      <Landing />
                      <Footer />
                    </>
                  } />
                  <Route path="/docs" element={
                    <>
                      <Header />
                      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-white">
                        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
                        <p className="text-gray-400">Coming soon...</p>
                      </div>
                      <Footer />
                    </>
                  } />

                  {/* Protected App Routes */}
                  <Route path="/app/*" element={
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mint" element={<MintPage />} />
                        <Route path="/passport" element={<PassportPage />} />
                        <Route path="/audits" element={<AuditsPage />} />
                        <Route path="/trade" element={<TradePage />} />
                      </Routes>
                    </DashboardLayout>
                  } />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </WalletProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
