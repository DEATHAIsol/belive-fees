'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  wallet: string;
  tokens: number;
  tickets: number;
  winChance: string;
  percentage?: number;
}

export default function LeaderboardTable() {
  const [holders, setHolders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const response = await fetch('/api/ticket-holders');
        const data = await response.json();
        setHolders(data);
      } catch (error) {
        console.error('Error fetching holders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
    const interval = setInterval(fetchHolders, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, []);

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="bg-secondary rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(holders) || holders.length === 0) {
    return (
      <div className="bg-secondary rounded-lg p-6 text-center text-gray-400">
        No eligible ticket holders found for this round.
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Top Ticket Holders</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Rank</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Avatar</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Wallet</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Tickets</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Win Chance</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">% of Supply</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder, index) => (
              <tr key={holder.wallet} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {`#${index + 1}`}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {holder.wallet.slice(2, 4).toUpperCase()}
                  </div>
                </td>
                <td className="py-3 px-2 font-mono text-sm">{formatWallet(holder.wallet)}</td>
                <td className="py-3 px-2 text-sm">{formatNumber(holder.tickets)}</td>
                <td className="py-3 px-2 text-sm text-accent">{holder.winChance}%</td>
                <td className="py-3 px-2 text-sm text-gray-300">{holder.percentage ? holder.percentage.toFixed(2) : '0'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 