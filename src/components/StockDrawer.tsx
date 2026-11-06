'use client';

import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Building2, 
  DollarSign, 
  BarChart4, 
  PieChart, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { StockQuote, TimePeriod } from '@/lib/types';
import { formatCurrency, formatVolume } from '@/lib/market-data-service';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface StockDrawerProps {
  stock: StockQuote | null;
  onClose: () => void;
}

export const StockDrawer: React.FC<StockDrawerProps> = ({ stock, onClose }) => {
  const [chartPeriod, setChartPeriod] = useState<TimePeriod>('1M');

  if (!stock) return null;

  const isPos = stock.changePercent >= 0;
  const strokeColor = isPos ? '#10b981' : '#ef4444';
  const fillColor = isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  // Calculate 52W position percentage for progress bar
  const range52Diff = stock.week52High - stock.week52Low;
  const current52Pos = range52Diff > 0 
    ? Math.min(100, Math.max(0, ((stock.price - stock.week52Low) / range52Diff) * 100))
    : 50;

  // Calculate Day Range position percentage
  const dayRangeDiff = stock.dayHigh - stock.dayLow;
  const currentDayPos = dayRangeDiff > 0
    ? Math.min(100, Math.max(0, ((stock.price - stock.dayLow) / dayRangeDiff) * 100))
    : 50;

  // Mock Order Book Depth
  const orderBookBids = [
    { price: (stock.price * 0.999).toFixed(2), qty: 4500, total: 4500 },
    { price: (stock.price * 0.998).toFixed(2), qty: 8200, total: 12700 },
    { price: (stock.price * 0.997).toFixed(2), qty: 15400, total: 28100 },
    { price: (stock.price * 0.995).toFixed(2), qty: 22100, total: 50200 },
  ];

  const orderBookAsks = [
    { price: (stock.price * 1.001).toFixed(2), qty: 3800, total: 3800 },
    { price: (stock.price * 1.002).toFixed(2), qty: 9100, total: 12900 },
    { price: (stock.price * 1.003).toFixed(2), qty: 14800, total: 27700 },
    { price: (stock.price * 1.005).toFixed(2), qty: 24600, total: 52300 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0e1624] border-l border-[#263244] h-full flex flex-col shadow-2xl shadow-black overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#263244] bg-[#111827] sticky top-0 z-10 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1b2638] border border-[#2e3e57] flex items-center justify-center font-mono font-extrabold text-lg text-emerald-400">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-white tracking-wider">
                  {stock.symbol}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e2a3c] text-emerald-300 border border-emerald-500/30">
                  {stock.exchange}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  stock.dataStatus === 'REAL-TIME'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : stock.dataStatus === 'PREVIOUS CLOSE'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : stock.dataStatus === 'DELAYED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                }`}>
                  {stock.dataStatus}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141d2c] text-slate-400 border border-[#263244]">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {stock.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1a2436] hover:bg-[#25334c] text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price & Primary Status Banner */}
        <div className="p-6 border-b border-[#202b3c] bg-[#0c121e]">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-mono block">CURRENT MARKET PRICE</span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight mt-1">
                {formatCurrency(stock.price, stock.market)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">SESSION MOVEMENT</span>
              <div className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-lg mt-1 ${
                isPos 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPos ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="mt-6 pt-4 border-t border-[#1c2738]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <BarChart4 className="w-4 h-4 text-emerald-400" />
                <span>PRICE ACTION TIMELINE</span>
              </div>
              <div className="flex items-center gap-1 bg-[#141d2c] p-1 rounded-lg border border-[#263244] text-[11px] font-mono">
                {(['1D', '1W', '1M', '3M', '1Y'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2 py-0.5 rounded transition ${
                      chartPeriod === p
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stock.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    fontFamily="monospace"
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    tickFormatter={(val) => Number(val).toFixed(0)}
                    fontFamily="monospace"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      borderColor: '#263244', 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      color: '#f8fafc',
                      fontFamily: 'monospace'
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val), stock.market), 'Price']}
                  />
                  <ReferenceLine y={stock.previousClose} stroke="#64748b" strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={strokeColor} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorStock)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ranges Progress Bars */}
        <div className="p-6 border-b border-[#202b3c] space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            TRADING RANGES & SPREAD
          </h3>

          {/* Day Range */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Day Low: <span className="text-slate-200">{formatCurrency(stock.dayLow, stock.market)}</span></span>
              <span className="text-slate-400">Day High: <span className="text-slate-200">{formatCurrency(stock.dayHigh, stock.market)}</span></span>
            </div>
            <div className="w-full bg-[#1b2638] h-2 rounded-full relative overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${currentDayPos}%` }}
              />
            </div>
          </div>

          {/* 52-Week Range */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">52W Low: <span className="text-slate-200">{formatCurrency(stock.week52Low, stock.market)}</span></span>
              <span className="text-slate-400">52W High: <span className="text-slate-200">{formatCurrency(stock.week52High, stock.market)}</span></span>
            </div>
            <div className="w-full bg-[#1b2638] h-2 rounded-full relative overflow-hidden">
              <div 
                className="bg-blue-400 h-full rounded-full transition-all"
                style={{ width: `${current52Pos}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fundamental Statistics Grid */}
        <div className="p-6 border-b border-[#202b3c]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
            KEY FINANCIAL METRICS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">MARKET CAPITALIZATION</span>
              <span className="text-slate-100 font-bold text-sm">
                {formatCurrency(stock.marketCap, stock.market, true)}
              </span>
              <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                Src: {stock.marketCapSource} ({stock.marketCapQuality})
              </div>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">VOLUME (SESSION)</span>
              <span className="text-slate-100 font-bold text-sm">
                {formatVolume(stock.volume)}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">AVG VOLUME (30D)</span>
              <span className="text-slate-100 font-bold text-sm">
                {formatVolume(stock.avgVolume)}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">P/E RATIO (TTM)</span>
              <span className="text-slate-100 font-bold text-sm">
                {stock.peRatio > 0 ? stock.peRatio.toFixed(2) : 'N/A'}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">DIVIDEND YIELD</span>
              <span className="text-slate-100 font-bold text-sm">
                {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '0.00%'}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">BETA (5Y MONTHLY)</span>
              <span className="text-slate-100 font-bold text-sm">
                {stock.beta.toFixed(2)}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">PREVIOUS CLOSE</span>
              <span className="text-slate-100 font-bold text-sm">
                {formatCurrency(stock.previousClose, stock.market)}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">SESSION OPEN</span>
              <span className="text-slate-100 font-bold text-sm">
                {formatCurrency(stock.open, stock.market)}
              </span>
            </div>

            <div className="bg-[#111827] border border-[#202b3c] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] block">EPS (DILUTED)</span>
              <span className="text-slate-100 font-bold text-sm">
                {stock.currencySymbol}{stock.eps.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Level 2 Order Book Depth Mock */}
        <div className="p-6 border-b border-[#202b3c]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
            MARKET DEPTH (L2 SPREAD)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            {/* Bids */}
            <div className="bg-[#111827] border border-[#202b3c] rounded-lg p-2.5">
              <div className="flex justify-between text-emerald-400 font-bold pb-1.5 border-b border-[#1c2738]">
                <span>BID PRICE</span>
                <span>QTY</span>
              </div>
              {orderBookBids.map((b, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#182232] last:border-0">
                  <span className="text-emerald-300 font-semibold">{stock.currencySymbol}{b.price}</span>
                  <span className="text-slate-300">{b.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Asks */}
            <div className="bg-[#111827] border border-[#202b3c] rounded-lg p-2.5">
              <div className="flex justify-between text-rose-400 font-bold pb-1.5 border-b border-[#1c2738]">
                <span>ASK PRICE</span>
                <span>QTY</span>
              </div>
              {orderBookAsks.map((a, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#182232] last:border-0">
                  <span className="text-rose-300 font-semibold">{stock.currencySymbol}{a.price}</span>
                  <span className="text-slate-300">{a.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Provenance & Freshness */}
        <div className="p-6 border-b border-[#202b3c] font-mono text-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>DATA PROVENANCE & FRESHNESS</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              stock.dataStatus === 'DELAYED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : stock.dataStatus === 'PREVIOUS CLOSE'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-slate-700/60 text-slate-300 border border-slate-600'
            }`}>
              {stock.dataStatus}
            </span>
          </h3>

          <div className="bg-[#111827] border border-[#202b3c] rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Upstream Recorded Time:</span>
              <span className="font-semibold">{stock.upstreamTimestamp ? new Date(stock.upstreamTimestamp).toLocaleTimeString() : stock.lastUpdated}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Actual Market Data Age:</span>
              <span className="font-semibold">{stock.dataAgeMinutes !== null ? `${stock.dataAgeMinutes} minutes` : 'Session closing record'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Market Cap Attribution:</span>
              <span className="font-semibold">{stock.marketCapSource}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Data Quality Status:</span>
              <span className="text-slate-300">{stock.dataQualityNote}</span>
            </div>
          </div>

          {stock.market === 'INDIA' && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
              <strong>Notice:</strong> Sourced from an unofficial developer adapter for local private testing. Not an authorized commercial exchange feed.
            </div>
          )}
        </div>

        {/* Company Description */}
        <div className="p-6 text-xs leading-relaxed text-slate-300 font-sans">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            PROFILE & DISCLOSURE
          </h3>
          <p className="bg-[#111827] p-3.5 rounded-lg border border-[#202b3c] text-slate-300">
            {stock.description}
          </p>
        </div>

      </div>
    </div>
  );
};
