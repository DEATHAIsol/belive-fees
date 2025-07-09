# Bonk Spins

Spin your way to the next degen jackpot. Meme slot machine on Solana.

## Features
- Meme-heavy, animated 5-reel slot machine
- Solana wallet connect (BONK token required)
- Jackpot, Major, Minor win logic
- Prize pool and burn tracker
- Leaderboard with recent and all-time winners
- Dev Test page (jackpot always wins)
- MongoDB for round/spin history
- Responsive, TailwindCSS UI

## Pages
- Landing (Jackpot, breakdown, leaderboard preview)
- Slot Machine (main game)
- Leaderboard
- Dev Test (guaranteed jackpot)
- About

## Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd bonk-spins
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```
3. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   TOKEN_ADDRESS=your_bonk_token_address
   REWARD_WALLET=your_reward_wallet_address
   MONGODB_URI=mongodb://localhost:27017/bonk-spins
   SOLANA_TRACKER_API_KEY=your_api_key
   CRON_SECRET=your_cron_secret
   ```
4. **Run the app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints
- `/api/spin` — Main spin endpoint
- `/api/dev-spin` — Dev test (always jackpot)
- `/api/leaderboard` — Leaderboard data
- `/api/current-prize-pool` — Current prize pool
- `/api/history` — Spin/round history

## License
MIT 