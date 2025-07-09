'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnect: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletMultiButton className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors" />
      
      {connected && publicKey && (
        <div className="text-sm text-gray-300">
          Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 