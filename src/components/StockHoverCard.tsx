'use client';

import React from 'react';
import { StockQuote } from '@/lib/types';
import { formatCurrency, formatVolume } from '@/lib/market-data-service';
import { TrendingUp, TrendingDown, Layers, BarChart2 } from 'lucide-react';

interface StockHoverCardProps {
  stock: StockQuote | null;
  position: { x: number; y: number } | null;
}

export const StockHoverCard: React.FC<StockHoverCardProps> = ({ stock, position }) => {
  if (!stock || !position) return null;

  const isPos = stock.changePercent >= 0;
  
  // Position adjustments so tooltip stays inside viewport
  const cardWidth = 300;
  const cardHeight = 220;
  
  let left = position.x + 16;
  let top = position.y + 16;

  if (typeof window !== 'undefined') {
    if (left + cardWidth > window.innerWidth - 16) {
      left = position.x - cardWidth - 16;
    }
    if (top + cardHeight > window.innerHeight - 16) {
      top = position.y - cardHeight - 16;
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
        pointerEvents: 'none',
      }}
      className="z-50 bg-[#111827]/98 backdrop-blur-xl border border-[#2e3e57] rounded-xl p-3.5 shadow-2xl shadow-black/80 animate-fade-in font-sans"
    >
      {/* Header: Symbol, Name & Exchange */}
      <div className="flex items-start justify-between gap-2 border-b border-[#1f293d] pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-mono text-base text-white tracking-wider">
              {stock.symbol}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-300 border border-[#334155]">
              {stock.exchange}
            </span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
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
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">
            {stock.name}
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-[#090D14] border border-[#263244]">
          {stock.sector}
        </span>
      </div>

      {/* Price & Movement */}
      <div className="py-2.5 flex items-baseline justify-between">
        <div>
          <span className="text-xl font-bold font-mono text-white">
            {formatCurrency(stock.price, stock.market)}
          </span>
        </div>
        <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded ${
          isPos ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        }`}>
          {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>
            {isPos ? '+' : ''}{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1f293d] text-[11px] font-mono">
        <div>
          <span className="text-slate-400 block text-[10px]">MARKET CAP</span>
          <span className="text-slate-200 font-semibold">
            {formatCurrency(stock.marketCap, stock.market, true)}
          </span>
          <span className="text-[9px] text-slate-500 block truncate">
            Src: {stock.marketCapSource}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">VOLUME</span>
          <span className="text-slate-200 font-semibold">
            {formatVolume(stock.volume)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">DAY RANGE</span>
          <span className="text-slate-300">
            {formatCurrency(stock.dayLow, stock.market)} - {formatCurrency(stock.dayHigh, stock.market)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">P/E RATIO</span>
          <span className="text-slate-300 font-semibold">
            {stock.peRatio > 0 ? stock.peRatio.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#1f293d] flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Click for complete technical analytics</span>
        <span className="text-emerald-400 font-semibold">VIEW &rarr;</span>
      </div>
    </div>
  );
};
