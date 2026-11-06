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
  onMarketChange,
  onExchangeChange,
  onViewChange,
  gainersCount,
  losersCount,
}) => {
  const exchanges: { id: Exchange; label: string }[] = currentMarket === 'INDIA'
    ? [
        { id: 'ALL', label: 'All Exchanges' },
        { id: 'NSE', label: 'NSE (National)' },
        { id: 'BSE', label: 'BSE (Bombay)' },
      ]
    : [
        { id: 'ALL', label: 'All Exchanges' },
        { id: 'NASDAQ', label: 'NASDAQ' },
        { id: 'NYSE', label: 'NYSE' },
      ];

  return (
    <div className="bg-[#111827] border-b border-[#263244] px-4 lg:px-6 py-3">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: View Tabs (TOP GAINERS / TOP LOSERS / ALL) */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => onViewChange('GAINERS')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'GAINERS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 bg-[#0c121e] border border-[#202b3c]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>TOP GAINERS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              {gainersCount}
            </span>
          </button>

          <button
            onClick={() => onViewChange('LOSERS')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'LOSERS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/40'
                : 'text-slate-400 hover:text-slate-200 bg-[#0c121e] border border-[#202b3c]'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>TOP LOSERS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-400 border border-rose-800/40">
              {losersCount}
            </span>
          </button>

          <button
            onClick={() => onViewChange('ALL')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider font-mono transition-all uppercase whitespace-nowrap ${
              currentView === 'ALL'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#0c121e] border border-[#202b3c]'
            }`}
            title="Complete Market Overview (Gainers & Losers combined)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">FULL SPECTRUM</span>
          </button>
        </div>

        {/* Right: Exchange Filter Sub-Tabs */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            EXCHANGE:
          </span>
          <div className="inline-flex p-1 rounded-lg bg-[#0c121e] border border-[#263244]">
            {exchanges.map(ex => (
              <button
                key={ex.id}
                onClick={() => onExchangeChange(ex.id)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition ${
                  currentExchange === ex.id
                    ? 'bg-[#1e293b] text-slate-100 shadow-sm border border-[#334155]'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
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
