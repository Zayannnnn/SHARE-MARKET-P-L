'use client';

import React from 'react';
import { 
  BarChart3, 
  RotateCw, 
  Search, 
  Clock, 
  Radio, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Market, MarketStatus, DataFeedStatus } from '@/lib/types';

interface HeaderProps {
  currentMarket: Market;
  onMarketChange: (market: Market) => void;
  marketStatus?: MarketStatus;
  feedStatus?: DataFeedStatus;
  lastUpdatedText: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMarket,
  onMarketChange,
  marketStatus,
  feedStatus,
  lastUpdatedText,
  isRefreshing,
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  onOpenSearch,
}) => {
  return (
    <header className="border-b border-[#263244] bg-[#090D14]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Market Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-slate-100 font-mono">
                  MARKET<span className="text-emerald-400">MAP</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest font-semibold rounded bg-[#1f293d] text-slate-400 border border-[#2e3e57]">
                  TERMINAL v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Institutional Market Heatmap Engine
              </p>
            </div>
          </div>

          {/* Market Segment Toggle (India / USA) */}
          <div className="inline-flex p-1 rounded-lg bg-[#111827] border border-[#263244]">
            <button
              onClick={() => onMarketChange('INDIA')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentMarket === 'INDIA'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-sm">🇮🇳</span>
              <span>INDIA</span>
              <span className="text-[10px] opacity-70 font-mono">NSE • BSE</span>
            </button>
            <button
              onClick={() => onMarketChange('USA')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentMarket === 'USA'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-sm">🇺🇸</span>
              <span>USA</span>
              <span className="text-[10px] opacity-70 font-mono">NASDAQ • NYSE</span>
            </button>
          </div>
        </div>

        {/* Center: Market Status Indicator */}
        <div className="hidden lg:flex items-center gap-3 bg-[#111827]/70 border border-[#263244] px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {marketStatus?.isOpen ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-amber-500/80"></span>
              )}
            </span>
            <span className="text-slate-300 font-semibold">
              {currentMarket === 'INDIA' ? 'NSE/BSE' : 'NYSE/NASDAQ'}:
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                marketStatus?.isOpen
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {marketStatus?.statusText || 'CLOSED'}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">LOCAL:</span>
            <span className="font-semibold text-slate-200">{marketStatus?.currentLocalTime || 'Live Clock'}</span>
            <span className="text-slate-600">({marketStatus?.sessionHours})</span>
          </div>

          {feedStatus && (
            <>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                {/* Health Status Indicator */}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  feedStatus.providerHealth === 'CONNECTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : feedStatus.providerHealth === 'RATE_LIMITED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : feedStatus.providerHealth === 'INVALID_API_KEY'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                }`}>
                  {feedStatus.providerHealth}
                </span>

                <span className="text-slate-300 font-semibold">{feedStatus.statusNote}</span>

                {feedStatus.isUnofficialDevSource && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    UNOFFICIAL DEV FEED
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Actions, Search, Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#263244] text-slate-300 hover:text-white hover:border-slate-500 text-xs transition"
            title="Search stock or ticker (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search ticker</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#1f2937] text-slate-400 border border-[#374151]">
              ⌘K
            </kbd>
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
              autoRefresh
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                : 'bg-[#111827] border-[#263244] text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle simulated 5s real-time ticks"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>LIVE 5s</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#263244] text-slate-200 hover:border-emerald-500/50 hover:text-emerald-400 text-xs font-medium transition disabled:opacity-50"
            title="Refresh Quotes"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Last sync timestamp */}
          <div className="hidden xl:flex flex-col text-right font-mono text-[10px] text-slate-400">
            <span className="text-slate-500">SYNCED</span>
            <span className="text-slate-300">{lastUpdatedText}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
