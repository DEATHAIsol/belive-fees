'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

interface RoundHistory {
  round: number;
  timestamp: string;
  winner: string;
  rewardAmount: string;
  totalHolders: number;
  totalTickets: number;
}

export default function HistoryPage() {
  const [rounds, setRounds] = useState<RoundHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();
        setRounds(data.rounds || []);
      } catch (error) {
        console.error('Error fetching history:', error);
        // Mock data for development
        setRounds([
          {
            round: 24,
            timestamp: '2025-01-05T12:00:00Z',
            winner: 'Wallet1...',
            rewardAmount: '12.29',
            totalHolders: 45,
            totalTickets: 12500
          },
          {
            round: 23,
            timestamp: '2025-01-05T11:00:00Z',
            winner: 'Wallet2...',
            rewardAmount: '11.85',
            totalHolders: 43,
            totalTickets: 11800
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Round History</h1>
        
        <div className="bg-secondary rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Past Winners</h2>
          
          {rounds.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No rounds completed yet.</p>
          ) : (
            <div className="space-y-4">
              {rounds.map((round) => (
                <div key={round.round} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                        #{round.round}
                      </div>
                      <div>
                        <h3 className="font-semibold">Round {round.round}</h3>
                        <p className="text-sm text-gray-400">{formatDate(round.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Winner:</span>
                        <p className="font-mono">{formatWallet(round.winner)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Reward:</span>
                        <p className="font-semibold text-accent">${round.rewardAmount} USDC</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Holders:</span>
                        <p>{round.totalHolders}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Tickets:</span>
                        <p>{round.totalTickets.toLocaleString()}</p>
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
} 