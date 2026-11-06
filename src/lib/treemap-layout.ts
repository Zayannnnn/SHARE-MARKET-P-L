import { hierarchy, treemap, treemapSquarify, HierarchyRectangularNode } from 'd3-hierarchy';
import { StockQuote, TreemapNode } from './types';

interface HierarchyItem {
  name: string;
  stock?: StockQuote;
  children?: HierarchyItem[];
  value?: number;
}

/**
 * Computes responsive squarified treemap bounding boxes for stocks
 */
export function computeTreemap(
  stocks: StockQuote[],
  width: number,
  height: number,
  padding: number = 3
): TreemapNode[] {
  if (!stocks || stocks.length === 0 || width <= 0 || height <= 0) {
    return [];
  }

  // Build hierarchy tree
  const rootData: HierarchyItem = {
    name: 'root',
    children: stocks.map(stock => {
      const safeCap = typeof stock.marketCap === 'number' && !isNaN(stock.marketCap) && stock.marketCap > 0
        ? stock.marketCap
        : 1000000000; // Safe default 1B / 1000 Cr fallback
      return {
        name: stock.symbol,
        stock,
        value: safeCap,
      };
    }),
  };

  const root = hierarchy<HierarchyItem>(rootData)
    .sum(d => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  // Initialize squarified treemap generator
  const treemapLayout = treemap<HierarchyItem>()
    .size([width, height])
    .tile(treemapSquarify.ratio(1.2))
    .paddingInner(padding)
    .paddingOuter(0)
    .round(true);

  const rectangularRoot = treemapLayout(root) as HierarchyRectangularNode<HierarchyItem>;

  const nodes: TreemapNode[] = [];

  if (rectangularRoot.leaves) {
    for (const leaf of rectangularRoot.leaves()) {
      if (leaf.data.stock) {
        const x0 = leaf.x0;
        const y0 = leaf.y0;
        const x1 = leaf.x1;
        const y1 = leaf.y1;
        const w = Math.max(0, x1 - x0);
        const h = Math.max(0, y1 - y0);

        nodes.push({
          stock: leaf.data.stock,
          x0,
          y0,
          x1,
          y1,
          width: w,
          height: h,
        });
      }
    }
  }

  return nodes;
}

/**
 * Returns color style based on percentage change and market view
 * Positive stocks: Green background (stronger percentage = stronger intensity)
 * Negative stocks: Red background (stronger drop = stronger intensity)
 * Neutral/0.00: Neutral grey
 */
export function getTileColorStyle(changePercent: number): {
  bg: string;
  border: string;
  text: string;
  accent: string;
  intensity: 'muted' | 'medium' | 'high' | 'extreme' | 'neutral';
} {
  const abs = Math.abs(changePercent);

  if (changePercent > 0.05) {
    // Green spectrum
    if (abs >= 5.0) {
      return {
        bg: 'bg-[#10b981]', // radiant emerald
        border: 'border-[#34d399]/40',
        text: 'text-slate-950 font-bold',
        accent: 'text-slate-900',
        intensity: 'extreme',
      };
    } else if (abs >= 3.0) {
      return {
        bg: 'bg-[#059669]', // deep vibrant green
        border: 'border-[#10b981]/40',
        text: 'text-white font-bold',
        accent: 'text-emerald-100',
        intensity: 'high',
      };
    } else if (abs >= 1.5) {
      return {
        bg: 'bg-[#047857]', // rich medium green
        border: 'border-[#059669]/40',
        text: 'text-white font-semibold',
        accent: 'text-emerald-200',
        intensity: 'medium',
      };
    } else {
      return {
        bg: 'bg-[#064e3b]', // subtle dark green
        border: 'border-[#047857]/50',
        text: 'text-emerald-100 font-medium',
        accent: 'text-emerald-300',
        intensity: 'muted',
      };
    }
  } else if (changePercent < -0.05) {
    // Red spectrum
    if (abs >= 5.0) {
      return {
        bg: 'bg-[#ef4444]', // fiery scarlet
        border: 'border-[#f87171]/40',
        text: 'text-white font-bold',
        accent: 'text-red-100',
        intensity: 'extreme',
      };
    } else if (abs >= 3.0) {
      return {
        bg: 'bg-[#dc2626]', // vivid crimson
        border: 'border-[#ef4444]/40',
        text: 'text-white font-bold',
        accent: 'text-red-100',
        intensity: 'high',
      };
    } else if (abs >= 1.5) {
      return {
        bg: 'bg-[#b91c1c]', // medium deep red
        border: 'border-[#dc2626]/40',
        text: 'text-white font-semibold',
        accent: 'text-red-200',
        intensity: 'medium',
      };
    } else {
      return {
        bg: 'bg-[#7f1d1d]', // subtle dark maroon
        border: 'border-[#991b1b]/50',
        text: 'text-red-100 font-medium',
        accent: 'text-red-300',
        intensity: 'muted',
      };
    }
  } else {
    // Neutral grey for unchanged (0.00%)
    return {
      bg: 'bg-[#1f2937]',
      border: 'border-[#374151]',
      text: 'text-slate-300 font-medium',
      accent: 'text-slate-400',
      intensity: 'neutral',
    };
  }
}
