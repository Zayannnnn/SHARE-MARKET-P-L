# MARKETMAP 📈
### Institutional-Grade Stock Market Heatmap & Financial Analytics Terminal

**MARKETMAP** is a modern, responsive, high-performance financial market visualization web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **D3 Hierarchy**.

It visualizes equity movements through squarified rectangular heatmaps (treemaps), providing institutional-level market breadth analysis for both **Indian (NSE & BSE)** and **US (NASDAQ & NYSE)** stock markets.

---

## 🚀 Key Features

### 1. Dual Market & Multi-Exchange Support
- **Indian Market (🇮🇳)**: Complete coverage across the **NSE (National Stock Exchange)** and **BSE (Bombay Stock Exchange)**.
- **US Market (🇺🇸)**: Complete coverage across the **NASDAQ** and **NYSE (New York Stock Exchange)**.
- **Dynamic Indices Ticker Tape**: Real-time marquee tracking NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT, S&P 500, NASDAQ 100, DOW JONES, and RUSSELL 2000.

### 2. Gainers & Losers Heatmap Views
- **TOP GAINERS View**: Green rectangular heatmap sorted by percentage gains.
- **TOP LOSERS View**: Red rectangular heatmap sorted by percentage declines.
- **FULL SPECTRUM View**: Unified dual-color heatmap displaying both advances and declines simultaneously.

### 3. Professional Squarified Treemap Visualization
- **Market Capitalization Proportional Sizing**: Each stock's tile area is strictly calculated using `d3-hierarchy`'s squarified treemap algorithm based on current market capitalization.
- **Color Intensity Mapping**:
  - **Gainers**: Forest green (`+0.5%`) $\rightarrow$ Emerald green (`+1.5%`) $\rightarrow$ Radiant green (`+3.0%`) $\rightarrow$ High-intensity neon green (`≥ +5.0%`).
  - **Losers**: Deep maroon (`-0.5%`) $\rightarrow$ Crimson red (`-1.5%`) $\rightarrow$ Scarlet red (`-3.0%`) $\rightarrow$ Fiery coral red (`≤ -5.0%`).
  - **Unchanged**: Neutral slate dark grey (`0.00%`).
- **Responsive Dynamic Content**:
  - *Large Tiles*: Company Name, Ticker, Percentage Change, Current Price, Exchange Pill.
  - *Medium Tiles*: Ticker, Percentage Change, Price.
  - *Small Tiles*: Ticker, Percentage Change.
  - *Tiny Tiles*: Prominent Ticker.

### 4. Interactive Stock Drawer & Analytics Panel
- Slide-over inspection drawer on clicking any stock:
  - **Interactive Historical Price Chart**: Smooth SVG Area chart with gradient fill powered by Recharts.
  - **Time Range Selector**: 1D, 1W, 1M, 3M, 1Y horizons with baseline reference line.
  - **Day Range & 52-Week Range**: Progress meters showing current price relative to 52W Low/High and Day Low/High.
  - **Fundamental Ratios**: Market Cap, Volume, 30D Average Volume, P/E Ratio (TTM), Dividend Yield, Beta (5Y), EPS, Previous Close, and Open.
  - **Level 2 Market Depth (L2 Spread)**: Real-time visual bid/ask order book.
  - **Business Profile**: Detailed corporate overview and sector disclosures.

### 5. Instant Search & Multi-Dimensional Filtering
- **Quick Search Palette**: Search instantly by company name, ticker, or sector with `⌘K` / `Ctrl+K`.
- **Market Cap Filters**: All, Mega/Large Cap, Mid Cap, Small Cap.
- **Sector Filter**: Technology, Financials, Energy, Automobile, Healthcare, Consumer Goods, Industrials, etc.
- **Sorting Options**: By % Change (High to Low / Low to High), Market Cap, or Trading Volume.
- **Time Periods**: 1D, 1W, 1M, 3M, 1Y with calculated return adjustments.
- **Clear Filters**: 1-click reset to restore default view.

### 6. Institutional Architecture & Data Integrity
- **Transparent Data Status**: Clearly distinguishes `REAL-TIME STREAMING`, `15-MIN DELAYED`, or `OFFICIAL SESSION CLOSING PRICES`.
- **Trading Hours & Holiday Calendars**:
  - Indian Market: 09:15 – 15:30 IST (incorporates official NSE/BSE holidays).
  - US Market: 09:30 – 16:00 EST (incorporates official NYSE/NASDAQ holidays).
  - Independent clocks displaying current local time in IST and EST.
- **Server-Side API Route (`/api/market-data`)**:
  - API keys remain strictly confidential on the server.
  - Memory-cached layer (20-second TTL) to protect upstream API rate limits.
  - Built-in sliding-window IP rate limiter (HTTP 429 guard).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Heatmap Layout**: [D3 Hierarchy](https://github.com/d3/d3-hierarchy) (`treemapSquarify`)
- **Charting**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js `v18.18+` or `v20+` or `v24+`
- npm `v9+` or `v10+`

### 2. Clone and Install Dependencies
```bash
# Navigate to the project directory
cd stk

# Install dependencies
npm install
```

### 3. Environment Variables (Optional for Live Feeds)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your financial data provider keys if you wish to stream live external quotes:
```env
# Optional external financial APIs:
TWELVE_DATA_API_KEY=your_key_here
FMP_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
```
> *Note: If no keys are provided, MARKETMAP runs on verified institutional closing and snapshot quotes with zero broken functionality.*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Production Deployment

### Deploying to Vercel
1. Push this repository to GitHub or GitLab.
2. Import the project into Vercel.
3. If using external API keys, add `TWELVE_DATA_API_KEY` or `FMP_API_KEY` in the Vercel Project Settings $\rightarrow$ **Environment Variables**.
4. Click **Deploy**.

### Deploying with Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📄 License
MIT License. Built for professional financial visualization and market analytics.
