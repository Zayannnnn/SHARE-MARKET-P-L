'use client';

import React from 'react';
import { TrendingUp, TrendingDown, LayoutGrid } from 'lucide-react';
import { Market, Exchange, MarketView } from '@/lib/types';

interface MarketNavigationProps {
  currentMarket: Market;
  currentExchange: Exchange;
  currentView: MarketView;
  onMarketChange: (market: Market) => void;
  onExchangeChange: (exchange: Exchange) => void;
  onViewChange: (view: MarketView) => void;
  gainersCount: number;
  losersCount: number;
}

export const MarketNavigation: React.FC<MarketNavigationProps> = ({
  currentMarket,
  currentExchange,
  currentView,
  onExchangeChange,
  onViewChange,
  gainersCount,
  losersCount,
}) => {
  const exchanges: { id: Exchange; label: string; sub: string }[] =
    currentMarket === 'INDIA'
      ? [
          { id: 'ALL', label: 'All Exchanges', sub: 'NSE + BSE' },
          { id: 'NSE', label: 'NSE', sub: 'National' },
          { id: 'BSE', label: 'BSE', sub: 'Bombay' },
        ]
      : [
          { id: 'ALL', label: 'All Exchanges', sub: 'NASDAQ + NYSE' },
          { id: 'NASDAQ', label: 'NASDAQ', sub: 'Tech & Growth' },
          { id: 'NYSE', label: 'NYSE', sub: 'Big Board' },
        ];

  return (
    <div className="bg-[#10151D] border-b border-[#202836] px-4 sm:px-6 py-2.5">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: View Tabs (TOP GAINERS / TOP LOSERS / FULL SPECTRUM) */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Top Gainers Tab */}
          <button
            onClick={() => onViewChange('GAINERS')}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'GAINERS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-slate-200 bg-[#080B10] border border-[#202836]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>TOP GAINERS</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              currentView === 'GAINERS'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                : 'bg-[#151C26] text-emerald-400 border border-emerald-500/20'
            }`}>
              {gainersCount}
            </span>
          </button>

          {/* Top Losers Tab */}
          <button
            onClick={() => onViewChange('LOSERS')}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'LOSERS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-md shadow-rose-950/60'
                : 'text-slate-400 hover:text-slate-200 bg-[#080B10] border border-[#202836]'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>TOP LOSERS</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              currentView === 'LOSERS'
                ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                : 'bg-[#151C26] text-rose-400 border border-rose-500/20'
            }`}>
              {losersCount}
            </span>
          </button>

          {/* Full Market Overview */}
          <button
            onClick={() => onViewChange('ALL')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'ALL'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/60 shadow-md shadow-blue-950/60'
                : 'text-slate-400 hover:text-slate-200 bg-[#080B10] border border-[#202836]'
            }`}
            title="Complete Market Overview (Gainers & Losers combined)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span>FULL SPECTRUM</span>
          </button>
        </div>

        {/* Right: Exchange Sub-Tabs */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
            EXCHANGE:
          </span>
          <div className="inline-flex p-1 rounded-lg bg-[#080B10] border border-[#202836]">
            {exchanges.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onExchangeChange(ex.id)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition ${
                  currentExchange === ex.id
                    ? 'bg-[#151C26] text-slate-100 font-bold border border-[#2D394A] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                title={ex.sub}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
