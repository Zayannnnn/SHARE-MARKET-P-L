'use client';

import React from 'react';
import { StockQuote } from '@/lib/types';
import { getTileColorStyle } from '@/lib/treemap-layout';
import { formatCurrency } from '@/lib/market-data-service';

interface TreemapTileProps {
  stock: StockQuote;
  width: number;
  height: number;
  x0: number;
  y0: number;
  onClick: (stock: StockQuote) => void;
  onHover: (stock: StockQuote, e: React.MouseEvent) => void;
  onLeave: () => void;
}

export const TreemapTile: React.FC<TreemapTileProps> = ({
  stock,
  width,
  height,
  x0,
  y0,
  onClick,
  onHover,
  onLeave,
}) => {
  const isPos = stock.changePercent >= 0;
  const colorStyle = getTileColorStyle(stock.changePercent);

  // Sizing tiers
  const isLarge = width >= 120 && height >= 85;
  const isMedium = (width >= 80 && height >= 55) || (width >= 65 && height >= 75);
  const isSmall = width >= 45 && height >= 35;
  const isTiny = !isSmall;

  // Format price
  const formattedPrice = formatCurrency(stock.price, stock.market);

  return (
    <div
      onClick={() => onClick(stock)}
      onMouseEnter={(e) => onHover(stock, e)}
      onMouseMove={(e) => onHover(stock, e)}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute',
        left: `${x0}px`,
        top: `${y0}px`,
        width: `${width}px`,
        height: `${height}px`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.25s ease',
      }}
      className={`group cursor-pointer rounded overflow-hidden select-none border ${colorStyle.bg} ${colorStyle.border} hover:z-20 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/60 flex flex-col items-center justify-center text-center p-1 relative`}
    >
      {/* Exchange pill badge for large tiles */}
      {isLarge && (
        <span className="absolute top-1 right-1 text-[9px] font-mono px-1 py-0.2 rounded bg-black/30 text-white/80 border border-white/10 uppercase">
          {stock.exchange}
        </span>
      )}

      {isLarge ? (
        // Large Tile Content
        <div className="flex flex-col items-center justify-center w-full px-1.5 py-1">
          <span className="font-extrabold font-mono text-sm sm:text-base tracking-wider text-white drop-shadow-sm">
            {stock.symbol}
          </span>
          <span className="text-[11px] text-white/80 truncate max-w-full font-medium leading-tight">
            {stock.name}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/25 text-white`}>
              {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
          <span className="text-[11px] font-mono text-white/90 mt-0.5 font-semibold">
            {formattedPrice}
          </span>
        </div>
      ) : isMedium ? (
        // Medium Tile Content
        <div className="flex flex-col items-center justify-center w-full px-1">
          <span className="font-extrabold font-mono text-xs sm:text-sm tracking-wide text-white drop-shadow-sm">
            {stock.symbol}
          </span>
          <span className="text-[11px] font-mono font-bold mt-0.5 text-white">
            {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
          {height >= 70 && (
            <span className="text-[10px] font-mono text-white/80 mt-0.5">
              {formattedPrice}
            </span>
          )}
        </div>
      ) : isSmall ? (
        // Small Tile Content
        <div className="flex flex-col items-center justify-center w-full overflow-hidden">
          <span className="font-bold font-mono text-[11px] leading-tight text-white truncate max-w-full">
            {stock.symbol}
          </span>
          {height >= 40 && (
            <span className="text-[9px] font-mono font-semibold text-white/95 leading-none mt-0.5">
              {isPos ? '+' : ''}{stock.changePercent.toFixed(1)}%
            </span>
          )}
        </div>
      ) : (
        // Tiny Tile Content
        <span className="font-bold font-mono text-[9px] text-white/90 truncate max-w-full leading-none">
          {stock.symbol}
        </span>
      )}
    </div>
  );
};
