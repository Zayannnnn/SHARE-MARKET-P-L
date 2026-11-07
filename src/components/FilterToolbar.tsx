'use client';

import React from 'react';
import { 
  Search, 
  ArrowUpDown, 
  X, 
  Calendar,
  Layers,
  PieChart,
  RotateCcw
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
    <div className="bg-[#0A0E16] border-b border-[#202836] px-4 sm:px-6 py-2">
      <div className="w-full flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Search & Time Horizons */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative w-full sm:w-52 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter ticker or name..."
              className="w-full bg-[#10151D] border border-[#202836] focus:border-emerald-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Time Period Selector (1D, 1W, 1M, 3M, 1Y) */}
          <div className="flex items-center gap-0.5 bg-[#10151D] p-1 rounded-lg border border-[#202836]">
            <Calendar className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline" />
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => onPeriodChange(period)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition ${
                  selectedPeriod === period
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151C26]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cap Category, Sector, Sort, Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Market Cap Filter */}
          <div className="flex items-center gap-1.5 bg-[#10151D] border border-[#202836] px-2.5 py-1 rounded-lg text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCap}
              onChange={(e) => onCapChange(e.target.value as CapCategory)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#10151D] text-slate-200">All Market Caps</option>
              <option value="LARGE" className="bg-[#10151D] text-slate-200">Large Cap</option>
              <option value="MID" className="bg-[#10151D] text-slate-200">Mid Cap</option>
              <option value="SMALL" className="bg-[#10151D] text-slate-200">Small Cap</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-1.5 bg-[#10151D] border border-[#202836] px-2.5 py-1 rounded-lg text-xs">
            <PieChart className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="ALL" className="bg-[#10151D] text-slate-200">All Sectors</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec} className="bg-[#10151D] text-slate-200">
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#10151D] border border-[#202836] px-2.5 py-1 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="PERCENT_DESC" className="bg-[#10151D] text-slate-200">% Change (High → Low)</option>
              <option value="PERCENT_ASC" className="bg-[#10151D] text-slate-200">% Change (Low → High)</option>
              <option value="MARKET_CAP_DESC" className="bg-[#10151D] text-slate-200">Market Cap (Large → Small)</option>
              <option value="VOLUME_DESC" className="bg-[#10151D] text-slate-200">Trading Volume</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-mono transition"
              title="Reset all search & category filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Visible Stocks Count */}
          <span className="text-[11px] font-mono text-slate-400 px-2 py-1 rounded bg-[#10151D] border border-[#202836]">
            {totalVisible} {totalVisible === 1 ? 'stock' : 'stocks'}
          </span>
        </div>

      </div>
    </div>
  );
};
