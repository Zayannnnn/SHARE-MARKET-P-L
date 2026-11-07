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

  // Sizing tiers for optimal typography density
  const isLarge = width >= 110 && height >= 80;
  const isMedium = (width >= 70 && height >= 50) || (width >= 60 && height >= 70);
  const isSmall = width >= 38 && height >= 28;
  const isTiny = !isSmall;

  // Formatted price string
  const formattedPrice = formatCurrency(stock.price, stock.market);

  // Text color based on tile background
  const textColor = colorStyle.hexText;

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
        backgroundColor: colorStyle.hexBg,
        borderColor: colorStyle.hexBorder,
        color: textColor,
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease',
      }}
      className="group cursor-pointer rounded overflow-hidden select-none border hover:z-20 hover:scale-[1.01] hover:brightness-110 hover:shadow-2xl hover:shadow-black/80 flex flex-col items-center justify-center text-center p-1 relative font-sans"
    >
      {/* Exchange pill badge for large tiles */}
      {isLarge && (
        <span className="absolute top-1 right-1 text-[8px] font-mono px-1 py-0.2 rounded bg-black/35 text-white/90 border border-white/10 uppercase tracking-wider">
          {stock.exchange}
        </span>
      )}

      {isLarge ? (
        // Large Tile: Symbol, Name, Change %, Price
        <div className="flex flex-col items-center justify-center w-full px-1.5 py-0.5">
          <span className="font-extrabold font-mono text-sm sm:text-base tracking-wide text-white drop-shadow-sm">
            {stock.symbol}
          </span>
          <span className="text-[11px] text-white/85 truncate max-w-full font-medium leading-tight mt-0.5">
            {stock.name}
          </span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/30 text-white shadow-inner">
              {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
          <span className="text-[11px] font-mono text-white/95 mt-0.5 font-bold">
            {formattedPrice}
          </span>
        </div>
      ) : isMedium ? (
        // Medium Tile: Symbol, Change %, Price (if space)
        <div className="flex flex-col items-center justify-center w-full px-1">
          <span className="font-extrabold font-mono text-xs sm:text-sm tracking-wide text-white drop-shadow-sm">
            {stock.symbol}
          </span>
          <span className="text-[11px] font-mono font-bold mt-0.5 text-white drop-shadow-sm">
            {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
          {height >= 65 && (
            <span className="text-[10px] font-mono text-white/90 mt-0.5 font-semibold">
              {formattedPrice}
            </span>
          )}
        </div>
      ) : isSmall ? (
        // Small Tile: Symbol, Change %
        <div className="flex flex-col items-center justify-center w-full px-0.5 overflow-hidden">
          <span className="font-bold font-mono text-[11px] leading-tight text-white truncate max-w-full">
            {stock.symbol}
          </span>
          <span className="text-[10px] font-mono font-bold text-white/95 leading-tight mt-0.5">
            {isPos ? '+' : ''}{stock.changePercent.toFixed(1)}%
          </span>
        </div>
      ) : (
        // Tiny Tile: Symbol only
        <span className="font-bold font-mono text-[9px] text-white truncate max-w-full px-0.5">
          {stock.symbol}
        </span>
      )}
    </div>
  );
};
