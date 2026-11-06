'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { StockQuote, TreemapNode, MarketView } from '@/lib/types';
import { computeTreemap } from '@/lib/treemap-layout';
import { TreemapTile } from './TreemapTile';
import { TreemapLegend } from './TreemapLegend';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface TreemapContainerProps {
  stocks: StockQuote[];
  currentView: MarketView;
  onSelectStock: (stock: StockQuote) => void;
  onHoverStock: (stock: StockQuote, e: React.MouseEvent) => void;
  onLeaveStock: () => void;
  onResetFilters?: () => void;
}

export const TreemapContainer: React.FC<TreemapContainerProps> = ({
  stocks,
  currentView,
  onSelectStock,
  onHoverStock,
  onLeaveStock,
  onResetFilters,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Monitor container size with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Compute squarified layout
  const nodes: TreemapNode[] = useMemo(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || stocks.length === 0) {
      return [];
    }
    return computeTreemap(stocks, dimensions.width, dimensions.height, 2.5);
  }, [stocks, dimensions]);

  return (
    <div className="flex flex-col flex-1 w-full bg-[#090D14] min-h-0">
      {/* Treemap Canvas Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] overflow-hidden bg-[#090D14] p-1.5"
      >
        {stocks.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0c121e]/80">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200 font-mono">NO STOCKS MATCH CRITERIA</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Adjust your search keywords, market cap filter, or selected sector to view stocks in this segment.
            </p>
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold font-mono transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          nodes.map((node) => (
            <TreemapTile
              key={node.stock.id}
              stock={node.stock}
              width={node.width}
              height={node.height}
              x0={node.x0}
              y0={node.y0}
              onClick={onSelectStock}
              onHover={onHoverStock}
              onLeave={onLeaveStock}
            />
          ))
        )}
      </div>

      {/* Finviz Legend & Aggregate Statistics */}
      <TreemapLegend stocks={stocks} currentView={currentView} />
    </div>
  );
};
