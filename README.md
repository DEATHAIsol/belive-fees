# Belive Jackpot

Hourly lottery for $BELIVE token holders on Solana.

## Features
- Dashboard with live stats and leaderboard
- Hourly round draws with weighted random winner
- MongoDB for round history
- Solana Tracker API for token and wallet data
- No wallet connection required

## Tech Stack
- Next.js (API & frontend)
- React & TailwindCSS (UI)
- MongoDB (round history)
- Solana Tracker API (data source)

## Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd belive-jackpot
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
   TOKEN_ADDRESS=your_spl_token_address_here
   REWARD_WALLET=your_reward_wallet_address_here
   MONGODB_URI=mongodb://localhost:27017/belive-jackpot
   SOLANA_TRACKER_API_KEY=your_api_key_if_needed
   CRON_SECRET=your_cron_secret
   ```

4. **Run the app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Set up the cron job:**
   Use a service like [cron-job.org](https://cron-job.org/) or your own scheduler to POST to `/api/cron` every hour:
   ```bash
   curl -X POST https://yourdomain.com/api/cron -H "Authorization: Bearer <CRON_SECRET>"
   ```

## API Endpoints
- `/api/latest-round` — Latest round info
- `/api/ticket-holders` — Top 10 ticket holders for leaderboard
- `/api/total-holders` — Total number of token holders
- `/api/total-contests` — Total contests
- `/api/current-prize-pool` — Current prize pool (SOL balance)
- `/api/history` — All round history
- `/api/cron` — Trigger a new round (POST)

## License
MIT 