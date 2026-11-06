'use client';

import React from 'react';
import { StockQuote, MarketView } from '@/lib/types';
import { formatVolume } from '@/lib/market-data-service';

interface TreemapLegendProps {
  stocks: StockQuote[];
  currentView: MarketView;
}

export const TreemapLegend: React.FC<TreemapLegendProps> = ({ stocks, currentView }) => {
  const advances = stocks.filter(s => s.changePercent > 0).length;
  const declines = stocks.filter(s => s.changePercent < 0).length;
  const unchanged = stocks.filter(s => s.changePercent === 0).length;
  const totalVolume = stocks.reduce((acc, s) => acc + s.volume, 0);

  const avgReturn = stocks.length > 0 
    ? stocks.reduce((acc, s) => acc + s.changePercent, 0) / stocks.length
    : 0;

  return (
    <div className="bg-[#090D14] border-t border-[#1c2738] px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
      
      {/* Left: Financial Color Spectrum Scale */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-semibold uppercase">Color Intensity:</span>
        <div className="flex items-center rounded overflow-hidden border border-[#263244] text-[10px]">
          <span className="bg-[#ef4444] text-white px-2 py-0.5 font-bold">&le; -5%</span>
          <span className="bg-[#dc2626] text-white px-2 py-0.5 font-semibold">-3%</span>
          <span className="bg-[#b91c1c] text-white px-1.5 py-0.5">-1.5%</span>
          <span className="bg-[#7f1d1d] text-white px-1.5 py-0.5">-0.5%</span>
          <span className="bg-[#1f2937] text-slate-400 px-2 py-0.5 font-bold">0%</span>
          <span className="bg-[#064e3b] text-white px-1.5 py-0.5">+0.5%</span>
          <span className="bg-[#047857] text-white px-1.5 py-0.5">+1.5%</span>
          <span className="bg-[#059669] text-white px-2 py-0.5 font-semibold">+3%</span>
          <span className="bg-[#10b981] text-slate-950 px-2 py-0.5 font-bold">&ge; +5%</span>
        </div>
      </div>

      {/* Right: Breadth & Stats */}
      <div className="flex flex-wrap items-center gap-4 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">BREADTH:</span>
          <span className="text-emerald-400 font-bold">{advances} Adv</span>
          <span className="text-slate-600">/</span>
          <span className="text-rose-400 font-bold">{declines} Dec</span>
          {unchanged > 0 && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{unchanged} Unch</span>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-slate-500">AVG MOVEMENT:</span>
          <span className={`font-bold ${avgReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-slate-500">AGGREGATE VOLUME:</span>
          <span className="text-slate-200 font-bold">{formatVolume(totalVolume)}</span>
        </div>
      </div>

    </div>
  );
};
