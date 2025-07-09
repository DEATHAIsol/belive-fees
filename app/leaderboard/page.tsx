'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface Winner {
  wallet: string;
  winType: string;
  prizeAmount?: number;
  timestamp: string;
  spinId: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'jackpot' | 'major' | 'minor'>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          setLeaderboard(await res.json());
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAllWinners = (): Winner[] => {
    if (!leaderboard) return [];
    
    const allWinners: Winner[] = [];
    
    // Add jackpot winners
    leaderboard.jackpotWinners.forEach((winner: any) => {
      allWinners.push({
        ...winner,
        winType: 'jackpot'
      });
    });
    
    // Add major winners
    leaderboard.majorWinners.forEach((winner: any) => {
      allWinners.push({
        ...winner,
        winType: 'major'
      });
    });
    
    // Add minor winners
    leaderboard.minorWinners.forEach((winner: any) => {
      allWinners.push({
        ...winner,
        winType: 'minor'
      });
    });
    
    // Sort by timestamp (newest first)
    return allWinners.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getFilteredWinners = () => {
    const allWinners = getAllWinners();
    if (activeTab === 'all') return allWinners;
    return allWinners.filter(winner => winner.winType === activeTab);
  };

  const getWinTypeColor = (winType: string) => {
    switch (winType) {
      case 'jackpot': return 'text-yellow-400';
      case 'major': return 'text-blue-400';
      case 'minor': return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  const getWinTypeIcon = (winType: string) => {
    switch (winType) {
      case 'jackpot': return '🏆';
      case 'major': return '💎';
      case 'minor': return '✨';
      default: return '🎰';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Leaderboard</h1>
            <p className="text-gray-400">All-time winners and their achievements</p>
          </div>
          <Link 
            href="/slot"
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            🎰 Play Now
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Winners', count: getAllWinners().length },
            { key: 'jackpot', label: 'Jackpot', count: leaderboard?.jackpotWinners?.length || 0 },
            { key: 'major', label: 'Major', count: leaderboard?.majorWinners?.length || 0 },
            { key: 'minor', label: 'Minor', count: leaderboard?.minorWinners?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Winners Table */}
        <div className="bg-secondary rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Wallet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Win Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Prize</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {getFilteredWinners().map((winner, index) => (
                  <tr key={winner.spinId || index} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                      {winner.wallet?.slice(0, 6)}...{winner.wallet?.slice(-4)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`flex items-center gap-2 font-medium ${getWinTypeColor(winner.winType)}`}>
                        <span>{getWinTypeIcon(winner.winType)}</span>
                        {winner.winType.charAt(0).toUpperCase() + winner.winType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {winner.prizeAmount ? `${winner.prizeAmount.toFixed(2)} SOL` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(winner.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {getFilteredWinners().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎰</div>
              <p className="text-gray-400 text-lg">No winners yet. Be the first to hit the jackpot!</p>
              <Link 
                href="/slot"
                className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Start Spinning
              </Link>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {leaderboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {leaderboard.jackpotWinners?.length || 0}
              </div>
              <div className="text-gray-400">Jackpot Wins</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {leaderboard.majorWinners?.length || 0}
              </div>
              <div className="text-gray-400">Major Wins</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {leaderboard.minorWinners?.length || 0}
              </div>
              <div className="text-gray-400">Minor Wins</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {getAllWinners().length}
              </div>
              <div className="text-gray-400">Total Winners</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 