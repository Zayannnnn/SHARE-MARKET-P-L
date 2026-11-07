'use client';

import React from 'react';
import { 
  BarChart3, 
  RotateCw, 
  Search, 
  Clock, 
  Radio, 
  Activity,
  Globe
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
    <header className="border-b border-[#202836] bg-[#080B10] sticky top-0 z-40 select-none">
      <div className="w-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand & Market Selector */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#10151D] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-slate-100 font-mono">
                  MARKET<span className="text-emerald-400">MAP</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono tracking-widest font-semibold rounded bg-[#10151D] text-slate-400 border border-[#202836]">
                  PRO v2.4
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden lg:block -mt-0.5">
                Institutional Financial Treemap
              </span>
            </div>
          </div>

          {/* Market Switcher (India / USA) */}
          <div className="inline-flex p-1 rounded-lg bg-[#10151D] border border-[#202836]">
            <button
              onClick={() => onMarketChange('INDIA')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentMarket === 'INDIA'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className="text-sm">🇮🇳</span>
              <span className="font-mono">INDIA</span>
              <span className="text-[10px] text-slate-400 hidden md:inline font-mono">
                NSE/BSE
              </span>
            </button>
            <button
              onClick={() => onMarketChange('USA')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentMarket === 'USA'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-950/50'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className="text-sm">🇺🇸</span>
              <span className="font-mono">USA</span>
              <span className="text-[10px] text-slate-400 hidden md:inline font-mono">
                NASDAQ/NYSE
              </span>
            </button>
          </div>
        </div>

        {/* Center: Live Market Status Indicator */}
        <div className="hidden 2xl:flex items-center gap-3 bg-[#10151D] border border-[#202836] px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {marketStatus?.isOpen ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="inline-flex rounded-full h-2 w-2 bg-amber-500/80"></span>
              )}
            </span>
            <span className="text-slate-400">
              {currentMarket === 'INDIA' ? 'NSE/BSE' : 'US MARKETS'}:
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                marketStatus?.isOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {marketStatus?.statusText || 'CLOSED'}
            </span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">TIME:</span>
            <span className="font-semibold text-slate-200">{marketStatus?.currentLocalTime || 'Live'}</span>
            <span className="text-slate-500">({marketStatus?.sessionHours || '09:15 - 15:30'})</span>
          </div>

          {feedStatus && (
            <>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-[11px] max-w-sm truncate">
                <Activity className="w-3 h-3 text-slate-500 shrink-0" />
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                  feedStatus.providerHealth === 'CONNECTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : feedStatus.providerHealth === 'RATE_LIMITED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                }`}>
                  {feedStatus.providerHealth}
                </span>
                <span className="text-slate-400 truncate">{feedStatus.statusNote}</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Search, Live 5s, Manual Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#10151D] border border-[#202836] text-slate-300 hover:text-white hover:border-slate-500 text-xs transition"
            title="Search stock or ticker (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#151C26] text-slate-400 border border-[#2D394A]">
              ⌘K
            </kbd>
          </button>

          {/* Live Auto-Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
              autoRefresh
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400 shadow-sm shadow-emerald-950'
                : 'bg-[#10151D] border-[#202836] text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle automatic 5s refresh ticks"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">LIVE 5s</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#10151D] border border-[#202836] text-slate-200 hover:border-emerald-500/50 hover:text-emerald-400 text-xs font-medium transition disabled:opacity-50"
            title="Refresh Quotes"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Last sync timestamp */}
          <div className="hidden 2xl:flex flex-col text-right font-mono text-[10px] text-slate-400">
            <span className="text-slate-500">LAST SYNC</span>
            <span className="text-slate-300">{lastUpdatedText}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
