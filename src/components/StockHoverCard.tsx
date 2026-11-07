'use client';

import React from 'react';
import { StockQuote } from '@/lib/types';
import { formatCurrency, formatVolume } from '@/lib/market-data-service';
import { TrendingUp, TrendingDown, Layers, ShieldCheck } from 'lucide-react';

interface StockHoverCardProps {
  stock: StockQuote | null;
  position: { x: number; y: number } | null;
}

export const StockHoverCard: React.FC<StockHoverCardProps> = ({ stock, position }) => {
  if (!stock || !position) return null;

  const isPos = stock.changePercent >= 0;

  // Viewport-safe positioning
  const cardWidth = 320;
  const cardHeight = 240;

  let left = position.x + 16;
  let top = position.y + 16;

  if (typeof window !== 'undefined') {
    if (left + cardWidth > window.innerWidth - 16) {
      left = position.x - cardWidth - 16;
    }
    if (top + cardHeight > window.innerHeight - 16) {
      top = position.y - cardHeight - 16;
    }
    // Safety check for top/left offscreen
    if (left < 8) left = 8;
    if (top < 8) top = 8;
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
      className="z-50 bg-[#10151D]/98 backdrop-blur-md border border-[#2D394A] rounded-xl p-3.5 shadow-2xl shadow-black/90 animate-fade-in font-sans select-none"
    >
      {/* Header: Symbol, Name & Exchange */}
      <div className="flex items-start justify-between gap-2 border-b border-[#202836] pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-mono text-base text-white tracking-wider">
              {stock.symbol}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151C26] text-slate-300 border border-[#2D394A]">
              {stock.exchange}
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
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
          <p className="text-xs text-slate-400 truncate max-w-[210px] mt-0.5">
            {stock.name}
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-[#080B10] border border-[#202836]">
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
        <div
          className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
            isPos
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}
        >
          {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>
            {isPos ? '+' : ''}{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Statistical Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#202836] text-[11px] font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">MARKET CAP</span>
          <span className="text-slate-200 font-semibold">
            {formatCurrency(stock.marketCap, stock.market, true)}
          </span>
          <span className="text-[9px] text-slate-500 block truncate">
            {stock.capCategory} CAP
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">24H VOLUME</span>
          <span className="text-slate-200 font-semibold">{formatVolume(stock.volume)}</span>
          <span className="text-[9px] text-slate-500 block">
            PREV: {formatCurrency(stock.previousClose, stock.market)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">DAY RANGE</span>
          <span className="text-slate-300">
            {formatCurrency(stock.dayLow, stock.market)} - {formatCurrency(stock.dayHigh, stock.market)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">52-WEEK RANGE</span>
          <span className="text-slate-300">
            {formatCurrency(stock.week52Low, stock.market)} - {formatCurrency(stock.week52High, stock.market)}
          </span>
        </div>
      </div>

      {/* Footer notice */}
      <div className="mt-2.5 pt-1.5 border-t border-[#202836] flex items-center justify-between text-[9px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500/80" />
          <span>{stock.marketCapSource}</span>
        </span>
        <span>Click for full technical drawer</span>
      </div>
    </div>
  );
};
