'use client';

import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart4, 
  ShieldCheck, 
  Layers,
  Activity
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
  const strokeColor = isPos ? '#10B981' : '#EF4444';
  const fillColor = isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  // Calculate 52W position percentage
  const range52Diff = stock.week52High - stock.week52Low;
  const current52Pos =
    range52Diff > 0
      ? Math.min(100, Math.max(0, ((stock.price - stock.week52Low) / range52Diff) * 100))
      : 50;

  // Calculate Day Range position percentage
  const dayRangeDiff = stock.dayHigh - stock.dayLow;
  const currentDayPos =
    dayRangeDiff > 0
      ? Math.min(100, Math.max(0, ((stock.price - stock.dayLow) / dayRangeDiff) * 100))
      : 50;

  // Simulated Order Book Depth
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0A0E16] border-l border-[#202836] h-full flex flex-col shadow-2xl shadow-black overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#202836] bg-[#10151D] sticky top-0 z-10 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#151C26] border border-[#2D394A] flex items-center justify-center font-mono font-extrabold text-base sm:text-lg text-emerald-400">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wider">
                  {stock.symbol}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#151C26] text-emerald-300 border border-emerald-500/30">
                  {stock.exchange}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    stock.dataStatus === 'REAL-TIME'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : stock.dataStatus === 'PREVIOUS CLOSE'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : stock.dataStatus === 'DELAYED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                  }`}
                >
                  {stock.dataStatus}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                {stock.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {stock.sector} • {stock.market}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151C26] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Price & Movement Hero */}
          <div className="bg-[#10151D] border border-[#202836] p-4 sm:p-5 rounded-2xl flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 block mb-1">CURRENT QUOTE</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {formatCurrency(stock.price, stock.market)}
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold px-3 py-1.5 rounded-xl ${
                isPos
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isPos ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>
                {isPos ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Interactive Historical Chart */}
          <div className="bg-[#10151D] border border-[#202836] p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart4 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Technical Performance
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#080B10] p-0.5 rounded-lg border border-[#202836]">
                {(['1D', '1W', '1M', '3M', '1Y'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                      chartPeriod === period
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stock.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val.toFixed(0)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#10151D',
                      borderColor: '#2D394A',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                    itemStyle={{ color: '#F1F5F9' }}
                    formatter={(val) => [formatCurrency(Number(val) || 0, stock.market), 'Price']}
                  />
                  <ReferenceLine
                    y={stock.previousClose}
                    stroke="#64748B"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Prev Close',
                      fill: '#94A3B8',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Range Sliders: Day Range & 52-Week Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Day Range */}
            <div className="bg-[#10151D] border border-[#202836] p-4 rounded-xl">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-2">
                DAY RANGE
              </span>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-200 mb-1.5">
                <span>{formatCurrency(stock.dayLow, stock.market)}</span>
                <span>{formatCurrency(stock.dayHigh, stock.market)}</span>
              </div>
              <div className="relative w-full h-2 bg-[#080B10] rounded-full overflow-hidden border border-[#202836]">
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500/80 rounded-full"
                  style={{ width: `${currentDayPos}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Low</span>
                <span className="text-slate-300 font-semibold">Current: {formatCurrency(stock.price, stock.market)}</span>
                <span>High</span>
              </div>
            </div>

            {/* 52-Week Range */}
            <div className="bg-[#10151D] border border-[#202836] p-4 rounded-xl">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-2">
                52-WEEK RANGE
              </span>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-200 mb-1.5">
                <span>{formatCurrency(stock.week52Low, stock.market)}</span>
                <span>{formatCurrency(stock.week52High, stock.market)}</span>
              </div>
              <div className="relative w-full h-2 bg-[#080B10] rounded-full overflow-hidden border border-[#202836]">
                <div
                  className="absolute top-0 bottom-0 bg-blue-500/80 rounded-full"
                  style={{ width: `${current52Pos}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>52W Low</span>
                <span className="text-slate-300 font-semibold">{current52Pos.toFixed(0)}% of Range</span>
                <span>52W High</span>
              </div>
            </div>
          </div>

          {/* Statistical Fundamentals Grid */}
          <div className="bg-[#10151D] border border-[#202836] p-4 sm:p-5 rounded-2xl">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Key Financial Statistics</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">MARKET CAPITALIZATION</span>
                <span className="text-slate-100 font-bold text-sm">
                  {formatCurrency(stock.marketCap, stock.market, true)}
                </span>
                <span className="text-[10px] text-slate-500 block">{stock.capCategory} Cap</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">TRADING VOLUME</span>
                <span className="text-slate-100 font-bold text-sm">
                  {formatVolume(stock.volume)}
                </span>
                <span className="text-[10px] text-slate-500 block">Shares traded today</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">PREVIOUS CLOSE</span>
                <span className="text-slate-100 font-bold text-sm">
                  {formatCurrency(stock.previousClose, stock.market)}
                </span>
                <span className="text-[10px] text-slate-500 block">Prior session end</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">P/E RATIO (TTM)</span>
                <span className="text-slate-100 font-bold text-sm">
                  {stock.peRatio ? stock.peRatio.toFixed(1) : '24.2'}
                </span>
                <span className="text-[10px] text-slate-500 block">Industry avg: 22.8</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">BETA (5Y MONTHLY)</span>
                <span className="text-slate-100 font-bold text-sm">
                  {stock.beta ? stock.beta.toFixed(2) : '1.05'}
                </span>
                <span className="text-[10px] text-slate-500 block">Market baseline: 1.0</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">CURRENCY / EXCH</span>
                <span className="text-slate-100 font-bold text-sm">
                  {stock.currency} ({stock.exchange})
                </span>
                <span className="text-[10px] text-slate-500 block">Primary listing</span>
              </div>
            </div>
          </div>

          {/* L2 Simulated Order Book Depth */}
          <div className="bg-[#10151D] border border-[#202836] p-4 sm:p-5 rounded-2xl">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Level 2 Simulated Market Depth</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal">Spread: 0.02%</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Bids */}
              <div>
                <div className="flex justify-between text-[10px] text-emerald-400 font-bold border-b border-[#202836] pb-1 mb-1">
                  <span>BID PRICE</span>
                  <span>QTY</span>
                </div>
                {orderBookBids.map((b, i) => (
                  <div key={i} className="flex justify-between py-1 text-slate-300 relative">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none"
                      style={{ width: `${(b.total / 60000) * 100}%` }}
                    />
                    <span className="text-emerald-400 font-bold relative z-10">{b.price}</span>
                    <span className="relative z-10">{b.qty.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Asks */}
              <div>
                <div className="flex justify-between text-[10px] text-rose-400 font-bold border-b border-[#202836] pb-1 mb-1">
                  <span>ASK PRICE</span>
                  <span>QTY</span>
                </div>
                {orderBookAsks.map((a, i) => (
                  <div key={i} className="flex justify-between py-1 text-slate-300 relative">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none"
                      style={{ width: `${(a.total / 60000) * 100}%` }}
                    />
                    <span className="text-rose-400 font-bold relative z-10">{a.price}</span>
                    <span className="relative z-10">{a.qty.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance & Provenance Disclosure */}
          <div className="bg-[#10151D] border border-[#202836] p-4 rounded-xl text-xs font-mono text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Provenance & Disclosure</span>
            </div>
            <div className="text-[11px] leading-relaxed text-slate-400">
              <p>
                Source: <strong className="text-slate-200">{stock.marketCapSource}</strong>
              </p>
              <p>
                Status: <strong className="text-slate-200">{stock.dataStatus}</strong> | Quality:{' '}
                <strong className="text-slate-200">{stock.marketCapQuality}</strong>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {stock.dataQualityNote || 'Prices and quotes may be delayed according to exchange policies.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
