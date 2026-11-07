'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketIndex } from '@/lib/types';

interface MarketTickerTapeProps {
  indices: MarketIndex[];
}

export const MarketTickerTape: React.FC<MarketTickerTapeProps> = ({ indices }) => {
  if (!indices || indices.length === 0) return null;

  // Duplicate for smooth infinite looping
  const items = [...indices, ...indices, ...indices];

  return (
    <div className="w-full bg-[#080B10] border-b border-[#202836] overflow-hidden py-1.5 select-none">
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((idx, i) => {
          const isPos = idx.changePercent >= 0;
          return (
            <div
              key={`${idx.symbol}-${i}`}
              className="inline-flex items-center gap-2 px-5 border-r border-[#202836] text-xs font-mono"
            >
              <span className="text-slate-400 font-bold">{idx.symbol}</span>
              <span className="text-slate-200 font-semibold">
                {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center gap-1 font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {isPos ? '+' : ''}{idx.change.toFixed(2)} ({isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
