import Sidebar from '../../components/Sidebar';

export default function BuyPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Buy $BELIVE</h1>
        
        <div className="bg-secondary rounded-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Get Your Tickets</h2>
          <p className="text-gray-400 mb-6">
            Purchase $BELIVE tokens to participate in the hourly lottery. 
            Every 1,000 tokens equals 1 lottery ticket.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">How it works:</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• 1,000 $BELIVE = 1 lottery ticket</li>
                <li>• Only top 100 holders are eligible</li>
                <li>• Draws happen every hour</li>
                <li>• Winner takes the entire prize pool</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Current Stats:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Supply:</span>
                  <p className="font-semibold">1,000,000,000 $BELIVE</p>
                </div>
                <div>
                  <span className="text-gray-400">Next Draw:</span>
                  <p className="font-semibold text-accent">In ~1 hour</p>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-gray-400 mb-4">
                Connect your wallet to purchase $BELIVE tokens
              </p>
              <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 