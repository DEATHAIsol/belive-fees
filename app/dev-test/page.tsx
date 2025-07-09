'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const SYMBOLS = [
  { name: 'Bonk Dog', emoji: '🐶' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Rug', emoji: '🧶' },
  { name: 'Fire', emoji: '🔥' },
  { name: 'Diamond', emoji: '💎' },
  { name: 'Rocket', emoji: '🚀' },
  { name: 'Skull', emoji: '💀' },
];

export default function DevTestPage() {
  const [reels, setReels] = useState([0, 0, 0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [wallet, setWallet] = useState('demo-wallet'); // TODO: Replace with real wallet connect

  const spin = async (count = 1) => {
    if (spinning) return;
    setSpinning(true);
    for (let i = 0; i < count; i++) {
      // Call backend dev-spin API (always jackpot)
      const res = await fetch('/api/dev-spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet })
      });
      const data = await res.json();
      setReels(data.reels);
      setLog((prev) => [
        `Spin ${i + 1}: ${data.symbols.map((s: string) => {
          const found = SYMBOLS.find(sym => sym.name.toLowerCase().includes(s));
          return found ? found.emoji : s;
        }).join(' ')} (JACKPOT!)`,
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
        <h1 className="text-4xl font-bold mb-2 text-primary">Bonk Spins Dev Test</h1>
        <p className="mb-6 text-lg text-gray-400">Every spin is a jackpot for testing.</p>
        {!walletConnected ? (
          <button
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold mb-8"
            onClick={() => setWalletConnected(true)}
          >
            Connect Wallet
          </button>
        ) : (
          <>
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
              <div className="w-full max-w-md mt-6">
                <h3 className="text-lg font-bold mb-2">Spin Log</h3>
                <ul className="bg-gray-900 rounded-lg p-4 h-40 overflow-y-auto text-sm">
                  {log.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 