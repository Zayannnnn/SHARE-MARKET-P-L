'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockQuote } from '@/lib/types';
import { formatCurrency } from '@/lib/market-data-service';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockQuote[];
  onSelectStock: (stock: StockQuote) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#10151D] border border-[#2D394A] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#202836] flex items-center gap-3 bg-[#151C26]">
          <Search className="w-5 h-5 text-emerald-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ticker, company, or sector..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 rounded bg-[#080B10] text-slate-400 hover:text-white text-xs font-mono border border-[#202836]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#18202C]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              No matching stocks found for "{query}"
            </div>
          ) : (
            filtered.map((stock) => {
              const isPos = stock.changePercent >= 0;
              return (
                <div
                  key={stock.id}
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#151C26] rounded-xl cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#080B10] border border-[#202836] flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-sm text-white">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#080B10] text-slate-400 border border-[#202836]">
                          {stock.exchange}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                        {stock.name} • <span className="text-slate-500">{stock.sector}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="font-mono text-xs sm:text-sm font-bold text-white block">
                        {formatCurrency(stock.price, stock.market)}
                      </span>
                      <div className={`flex items-center justify-end gap-1 font-mono text-[11px] font-semibold ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#080B10] border-t border-[#202836] flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
          <span>{filtered.length} results</span>
          <span>Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
};
