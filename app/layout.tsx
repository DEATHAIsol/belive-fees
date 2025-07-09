import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bonk Spins',
  description: 'Spin your way to the next degen jackpot. Meme slot machine on Solana.',
}

const WalletContextProvider = dynamic(() => import('@/components/WalletProvider'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  )
} 