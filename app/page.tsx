'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { useWallet } from '@solana/wallet-adapter-react';

export default function LandingPage() {
  const { connected } = useWallet();
  const [jackpotState, setJackpotState] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jackpotRes, leaderboardRes] = await Promise.all([
          fetch('/api/jackpot-state'),
          fetch('/api/leaderboard')
        ]);
        
        if (jackpotRes.ok) {
          setJackpotState(await jackpotRes.json());
        }
        if (leaderboardRes.ok) {
          setLeaderboard(await leaderboardRes.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-yellow-400 mb-2">Bonk Spins</h1>
            <p className="text-xl text-gray-300">Spin your way to the next degen jackpot</p>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-6">🎰</div>
          <h2 className="text-4xl font-bold text-white mb-4">The Most Memeable Slot Machine on Solana</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the thrill of spinning with BONK tokens. Every spin brings you closer to the ultimate jackpot!
          </p>
          {connected ? (
            <Link 
              href="/slot"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors inline-block"
            >
              🚀 Start Spinning Now!
            </Link>
          ) : (
            <div className="text-gray-400 text-lg">
              Connect your wallet to start spinning!
            </div>
          )}
        </div>

        {/* Jackpot Display */}
        {jackpotState && (
          <div className="bg-gray-800 rounded-lg p-8 mb-12">
            <h3 className="text-3xl font-bold text-center text-yellow-400 mb-6">Current Jackpot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{jackpotState.pool.toFixed(2)} SOL</div>
                <div className="text-gray-400">Prize Pool</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">{jackpotState.burned.toFixed(2)} SOL</div>
                <div className="text-gray-400">Total Burned</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{jackpotState.spins}</div>
                <div className="text-gray-400">Total Spins</div>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mt-8">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Minor Win Progress</span>
                  <span>{Math.round(jackpotState.progress.minors * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-400 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${jackpotState.progress.minors * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Major Win Progress</span>
                  <span>{Math.round(jackpotState.progress.majors * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${jackpotState.progress.majors * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Fair & Transparent</h3>
            <p className="text-gray-300">Every spin uses provably fair RNG. No manipulation, just pure luck!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-white mb-2">Token Burning</h3>
            <p className="text-gray-300">20% of every spin goes to burning BONK tokens, increasing scarcity!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-white mb-2">Free Spins</h3>
            <p className="text-gray-300">Get 1 free spin for every 10,000 BONK tokens you own!</p>
          </div>
        </div>

        {/* Recent Winners */}
        {leaderboard && (
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center text-white mb-6">Recent Winners</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-bold text-yellow-400 mb-3">🏆 Jackpot Winners</h4>
                <div className="space-y-2">
                  {leaderboard.jackpotWinners.slice(0, 5).map((winner: any, i: number) => (
                    <div key={i} className="text-sm text-gray-300">
                      {winner.wallet?.slice(0, 6)}...{winner.wallet?.slice(-4)} - {winner.prizeAmount} SOL
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-400 mb-3">💎 Major Winners</h4>
                <div className="space-y-2">
                  {leaderboard.majorWinners.slice(0, 5).map((winner: any, i: number) => (
                    <div key={i} className="text-sm text-gray-300">
                      {winner.wallet?.slice(0, 6)}...{winner.wallet?.slice(-4)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-3">✨ Minor Winners</h4>
                <div className="space-y-2">
                  {leaderboard.minorWinners.slice(0, 5).map((winner: any, i: number) => (
                    <div key={i} className="text-sm text-gray-300">
                      {winner.wallet?.slice(0, 6)}...{winner.wallet?.slice(-4)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/leaderboard"
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                View Full Leaderboard →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-400">
        <p>Bonk Spins - The ultimate meme slot machine on Solana</p>
        <p className="text-sm mt-2">Built with ❤️ for the BONK community</p>
      </footer>
    </div>
  );
} 