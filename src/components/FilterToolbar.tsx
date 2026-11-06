'use client';

import React from 'react';
import { 
  Search, 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import { TimePeriod, CapCategory, SortBy } from '@/lib/types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  selectedCap: CapCategory;
  onCapChange: (cap: CapCategory) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  sectors: string[];
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
  totalVisible: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPeriod,
  onPeriodChange,
  selectedCap,
  onCapChange,
  selectedSector,
  onSectorChange,
  sectors,
  sortBy,
  onSortChange,
  onClearFilters,
  isFiltered,
  totalVisible,
}) => {
  const periods: TimePeriod[] = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <div className="bg-[#0e1522] border-b border-[#263244] px-4 lg:px-6 py-2.5">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Search & Time Horizons */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Quick Search Input */}
          <div className="relative w-full sm:w-56 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ticker or name..."
              className="w-full bg-[#141d2c] border border-[#263244] focus:border-emerald-500 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Time Period Selector (1D, 1W, 1M, 3M, 1Y) */}
          <div className="flex items-center gap-1 bg-[#141d2c] p-1 rounded-lg border border-[#263244]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {periods.map(period => (
              <button
                key={period}
                onClick={() => onPeriodChange(period)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
                  selectedPeriod === period
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2538]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cap Filter, Sector Filter, Sort, Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Market Cap Filter */}
          <div className="flex items-center gap-1.5 bg-[#141d2c] border border-[#263244] px-2.5 py-1 rounded-lg text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCap}
              onChange={(e) => onCapChange(e.target.value as CapCategory)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-[#111827] text-slate-200">All Market Caps</option>
              <option value="LARGE" className="bg-[#111827] text-slate-200">Large / Mega Cap</option>
              <option value="MID" className="bg-[#111827] text-slate-200">Mid Cap</option>
              <option value="SMALL" className="bg-[#111827] text-slate-200">Small Cap</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-1.5 bg-[#141d2c] border border-[#263244] px-2.5 py-1 rounded-lg text-xs">
            <PieChart className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer pr-1 max-w-[130px] sm:max-w-[160px] truncate"
            >
              <option value="ALL" className="bg-[#111827] text-slate-200">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector} className="bg-[#111827] text-slate-200">
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#141d2c] border border-[#263244] px-2.5 py-1 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="PERCENT_DESC" className="bg-[#111827] text-slate-200">Sort: % Change (High to Low)</option>
              <option value="PERCENT_ASC" className="bg-[#111827] text-slate-200">Sort: % Change (Low to High)</option>
              <option value="MARKET_CAP_DESC" className="bg-[#111827] text-slate-200">Sort: Market Cap</option>
              <option value="VOLUME_DESC" className="bg-[#111827] text-slate-200">Sort: Volume</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs transition font-mono"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Result Count Indicator */}
          <div className="px-2 py-1 rounded bg-[#141d2c] border border-[#263244] text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">{totalVisible}</span> stocks
          </div>
        </div>

      </div>
    </div>
  );
};
