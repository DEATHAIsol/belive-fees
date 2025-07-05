import axios from 'axios';

const SOLANA_TRACKER_BASE_URL = 'https://data.solanatracker.io';

export interface TokenHolder {
  wallet: string;
  tokens: number;
  tickets: number;
  percentage?: number;
}

export interface WalletBalance {
  balance: string;
  symbol: string;
}

export interface TokenInfo {
  holders: number;
  name: string;
  symbol: string;
}

export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
  try {
    const response = await axios.get(`${SOLANA_TRACKER_BASE_URL}/tokens/${tokenAddress}`, {
      headers: {
        'x-api-key': process.env.SOLANA_TRACKER_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });

    return {
      holders: response.data.holders || 0,
      name: response.data.token?.name || '',
      symbol: response.data.token?.symbol || ''
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    // Return mock data for development
    return {
      holders: 1250,
      name: 'BELIVE',
      symbol: 'BELIVE'
    };
  }
}

export async function getTokenHolders(tokenAddress: string): Promise<TokenHolder[]> {
  try {
    // Using Solana Tracker API to get top holders
    const response = await axios.get(`${SOLANA_TRACKER_BASE_URL}/tokens/${tokenAddress}/holders`, {
      headers: {
        'x-api-key': process.env.SOLANA_TRACKER_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });

    // Use 'accounts' array as per docs
    const accounts = response.data.accounts || [];

    // Transform and return top 100 holders
    const transformedHolders = accounts
      .slice(0, 100)
      .map((account: any) => ({
        wallet: account.wallet,
        tokens: account.amount,
        tickets: Math.floor(account.amount / 1000), // 1 ticket per 1000 tokens
        percentage: account.percentage
      }));

    return transformedHolders;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    // Return mock data for development
    return [
      { wallet: 'Wallet1...', tokens: 5000000, tickets: 5000, percentage: 0.5 },
      { wallet: 'Wallet2...', tokens: 3000000, tickets: 3000, percentage: 0.3 },
      { wallet: 'Wallet3...', tokens: 2000000, tickets: 2000, percentage: 0.2 },
    ];
  }
}

export async function getWalletBalance(walletAddress: string): Promise<WalletBalance> {
  try {
    // Using Solana Tracker API to get wallet balance (looking for SOL balance)
    const response = await axios.get(`${SOLANA_TRACKER_BASE_URL}/wallet/${walletAddress}/basic`, {
      headers: {
        'x-api-key': process.env.SOLANA_TRACKER_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });

    // Look for SOL balance in the tokens array
    const tokens = response.data.tokens || [];
    const solToken = tokens.find((token: any) => 
      token.address === 'So11111111111111111111111111111111111111112'
    );

    if (solToken) {
      return {
        balance: solToken.balance.toString(),
        symbol: 'SOL'
      };
    }

    // Fallback to USDC if SOL not found
    const usdcToken = tokens.find((token: any) => 
      token.address === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    if (usdcToken) {
      return {
        balance: usdcToken.balance.toString(),
        symbol: 'USDC'
      };
    }

    // Default fallback
    return {
      balance: '0',
      symbol: 'USDC'
    };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    // Return mock data for development
    return {
      balance: '12.29',
      symbol: 'SOL'
    };
  }
}

export function selectWinner(holders: TokenHolder[]): string {
  if (holders.length === 0) return '';
  
  // Calculate total tickets
  const totalTickets = holders.reduce((sum, holder) => sum + holder.tickets, 0);
  
  // Generate random number
  const random = Math.random() * totalTickets;
  
  // Find winner based on ticket distribution
  let currentSum = 0;
  for (const holder of holders) {
    currentSum += holder.tickets;
    if (random <= currentSum) {
      return holder.wallet;
    }
  }
  
  // Fallback to first holder
  return holders[0].wallet;
} 