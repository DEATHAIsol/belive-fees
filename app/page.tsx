'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import CountdownTimer from '../components/CountdownTimer';
import LeaderboardTable from '../components/LeaderboardTable';

interface DashboardData {
  lastRoundRewards: string;
  ticketHolders: number;
  totalSupply: string;
  totalContests: number;
  currentRound: number;
  prizePool: string;
  symbol: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    lastRoundRewards: '0',
    ticketHolders: 0,
    totalSupply: '1,000,000,000',
    totalContests: 0,
    currentRound: 1,
    prizePool: '0',
    symbol: 'USDC'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch latest round data
        const roundResponse = await fetch('/api/latest-round');
        const roundData = await roundResponse.json();

        // Fetch current prize pool
        const prizeResponse = await fetch('/api/current-prize-pool');
        const prizeData = await prizeResponse.json();

        // Fetch total contests
        const contestsResponse = await fetch('/api/total-contests');
        const contestsData = await contestsResponse.json();

        // Fetch total holders count
        const totalHoldersResponse = await fetch('/api/total-holders');
        const totalHoldersData = await totalHoldersResponse.json();

        setData({
          lastRoundRewards: roundData.rewardAmount || '0',
          ticketHolders: totalHoldersData.totalHolders || 0,
          totalSupply: '1,000,000,000',
          totalContests: contestsData.totalContests || 0,
          currentRound: (roundData.round || 0) + 1,
          prizePool: prizeData.prizePool || '0',
          symbol: prizeData.symbol || 'USDC'
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
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
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Last Round Rewards"
            value={`$${data.lastRoundRewards} ${data.symbol}`}
            icon="💰"
          />
          <StatCard
            title="Ticket Holders"
            value={data.ticketHolders.toString()}
            icon="👥"
          />
          <StatCard
            title="Total Supply"
            value={data.totalSupply}
            icon="🪙"
          />
          <StatCard
            title="Total Contests"
            value={data.totalContests.toString()}
            icon="🏆"
          />
        </div>

        {/* Current Round Section */}
        <div className="bg-secondary rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Round {data.currentRound}</h2>
              <p className="text-gray-400">Next draw in:</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <CountdownTimer />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Live Prize Pool</h3>
              <p className="text-3xl font-bold text-accent">${data.prizePool} {data.symbol}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <p className="text-lg text-green-400">Rewards should be distributed soon!</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <LeaderboardTable />
      </div>
    </div>
  );
} 