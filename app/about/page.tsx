import Sidebar from '../../components/Sidebar';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">About Belive Jackpot</h1>
        <div className="bg-secondary rounded-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">What is Belive Jackpot?</h2>
          <p className="text-gray-400 mb-6">
            Belive Jackpot is an hourly lottery for $BELIVE token holders on Solana. Every hour, the holders are entered into a draw, with tickets proportional to their holdings (1,000 tokens = 1 ticket). The winner receives the entire prize pool, which accumulates from fees in the reward wallet.
          </p>
          <h3 className="text-lg font-semibold mb-2">How does it work?</h3>
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• Every hour, a snapshot of the top 100 $BELIVE holders is taken</li>
            <li>• Each 1,000 tokens = 1 ticket</li>
            <li>• One winner is chosen at random, weighted by ticket count</li>
            <li>• The winner receives the full prize pool in USDC</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 