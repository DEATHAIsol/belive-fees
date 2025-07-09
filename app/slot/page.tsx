'use client';

import Sidebar from '@/components/Sidebar';
import WalletConnect from '@/components/WalletConnect';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const SYMBOLS = [
  { name: 'Bonk Dog', emoji: '🐶' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Rug', emoji: '🧶' },
  { name: 'Fire', emoji: '🔥' },
  { name: 'Diamond', emoji: '💎' },
  { name: 'Rocket', emoji: '🚀' },
  { name: 'Skull', emoji: '💀' },
];

export default function SlotMachinePage() {
  const { connected, publicKey } = useWallet();
  const [reels, setReels] = useState([0, 0, 0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [jackpotState, setJackpotState] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);

  useEffect(() => {
    const fetchJackpot = async () => {
      const res = await fetch('/api/jackpot-state');
      if (res.ok) setJackpotState(await res.json());
    };
    const fetchLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      if (res.ok) setLeaderboard(await res.json());
    };
    fetchJackpot();
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchJackpot();
      fetchLeaderboard();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const spin = async (count = 1) => {
    if (spinning || !publicKey) return;
    setSpinning(true);
    for (let i = 0; i < count; i++) {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString(), spinType: count === 1 ? 'single' : count === 10 ? 'ten' : 'hundred' })
      });
      const data = await res.json();
      setReels(data.reels || [0,0,0,0,0]);
      setLog((prev) => [
        `Spin ${i + 1}: ${data.symbols ? data.symbols.map((s: string) => {
          const found = SYMBOLS.find(sym => sym.name.toLowerCase().includes(s));
          return found ? found.emoji : s;
        }).join(' ') : ''}${data.winType ? (data.winType !== 'none' ? ' (' + data.winType.toUpperCase() + ')' : '') : (data.result && data.result !== 'none' ? ' (' + data.result.toUpperCase() + ')' : '')}`,
        ...prev.slice(0, 9)
      ]);
      await new Promise((r) => setTimeout(r, 800));
    }
    setSpinning(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Bonk Slots</h1>
        <p className="mb-2 text-lg text-gray-400">Spin your way to the next degen jackpot.</p>
        <p className="mb-6 text-accent font-semibold">1 free spin for every 10,000 tokens owned</p>
        <div className="mb-8">
          <WalletConnect />
        </div>
        {!connected ? (
          <div className="text-center text-gray-400 mb-8">
            Connect your wallet to start spinning!
          </div>
        ) : (
          <>
            {/* Jackpot Progress */}
            {jackpotState && (
              <div className="w-full max-w-xl bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold mb-2">Jackpot Progress</h3>
                <div className="mb-2">Minors: <span className="text-accent font-bold">{Math.round(jackpotState.progress.minors * 100)}%</span> | Majors: <span className="text-accent font-bold">{Math.round(jackpotState.progress.majors * 100)}%</span></div>
                <div className="w-full bg-gray-700 rounded h-3 overflow-hidden">
                  <div className="bg-primary h-3" style={{ width: `${jackpotState.progress.minors * 100}%` }}></div>
                </div>
                <div className="w-full bg-gray-700 rounded h-3 overflow-hidden mt-2">
                  <div className="bg-accent h-3" style={{ width: `${jackpotState.progress.majors * 100}%` }}></div>
                </div>
              </div>
            )}
            {/* Slot Machine */}
            <div className="bg-secondary rounded-lg p-8 flex flex-col items-center mb-8">
              <div className="flex space-x-4 mb-6">
                {reels.map((idx, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 flex items-center justify-center text-5xl bg-gray-800 rounded-lg border-4 border-primary shadow-lg"
                  >
                    {SYMBOLS[idx].emoji}
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 mb-4">
                <button
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                  onClick={() => spin(1)}
                  disabled={spinning}
                >
                  Spin 1x
                </button>
                <button
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                  onClick={() => spin(10)}
                  disabled={spinning}
                >
                  Spin 10x
                </button>
                <button
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                  onClick={() => spin(100)}
                  disabled={spinning}
                >
                  Spin 100x
                </button>
              </div>
              <p className="text-gray-400 mb-2">You must own at least 10,000 BONK tokens to spin.</p>
              <div className="w-full max-w-md mt-6">
                <h3 className="text-lg font-bold mb-2">Spin Log</h3>
                <ul className="bg-gray-900 rounded-lg p-4 h-40 overflow-y-auto text-sm">
                  {log.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Leaderboard Preview */}
            {leaderboard && (
              <div className="w-full max-w-xl bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold mb-2">Recent Winners</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-accent mb-1">Jackpot</h4>
                    <ul className="text-xs">
                      {leaderboard.jackpotWinners.map((w: any, i: number) => (
                        <li key={i}>{w.wallet?.slice(0, 6)}...{w.wallet?.slice(-4)} ({w.prizeAmount} SOL)</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Major</h4>
                    <ul className="text-xs">
                      {leaderboard.majorWinners.map((w: any, i: number) => (
                        <li key={i}>{w.wallet?.slice(0, 6)}...{w.wallet?.slice(-4)}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-1">Minor</h4>
                    <ul className="text-xs">
                      {leaderboard.minorWinners.map((w: any, i: number) => (
                        <li key={i}>{w.wallet?.slice(0, 6)}...{w.wallet?.slice(-4)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 