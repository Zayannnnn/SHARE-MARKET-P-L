import { hierarchy, treemap, treemapSquarify, HierarchyRectangularNode } from 'd3-hierarchy';
import { StockQuote, TreemapNode } from './types';

interface HierarchyItem {
  name: string;
  stock?: StockQuote;
  children?: HierarchyItem[];
  value?: number;
}

export interface TileColorStyle {
  bg: string;
  border: string;
  text: string;
  accent: string;
  hexBg: string;
  hexBorder: string;
  hexText: string;
  intensity: 'muted' | 'medium' | 'high' | 'extreme' | 'neutral';
}

/**
 * Computes responsive squarified treemap bounding boxes for stocks
 */
export function computeTreemap(
  stocks: StockQuote[],
  width: number,
  height: number,
  padding: number = 2
): TreemapNode[] {
  if (!stocks || stocks.length === 0 || width <= 0 || height <= 0) {
    return [];
  }

  // Build hierarchy tree
  const rootData: HierarchyItem = {
    name: 'root',
    children: stocks.map((stock) => {
      const safeCap =
        typeof stock.marketCap === 'number' && !isNaN(stock.marketCap) && stock.marketCap > 0
          ? stock.marketCap
          : 1000000000; // Safe default 1B fallback
      return {
        name: stock.symbol,
        stock,
        value: safeCap,
      };
    }),
  };

  const root = hierarchy<HierarchyItem>(rootData)
    .sum((d) => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  // Squarified treemap layout generator
  const treemapLayout = treemap<HierarchyItem>()
    .size([width, height])
    .tile(treemapSquarify.ratio(1.15))
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
 * Returns color styling with calibrated institutional hex codes and Tailwind classes.
 * - Positive stocks: Emerald spectrum (stronger % = higher intensity)
 * - Negative stocks: Crimson spectrum (stronger drop = higher intensity)
 * - Flat / 0.00%: Neutral dark slate
 */
export function getTileColorStyle(changePercent: number): TileColorStyle {
  const abs = Math.abs(changePercent);

  if (changePercent > 0.05) {
    // Green spectrum
    if (abs >= 5.0) {
      return {
        bg: 'bg-[#10B981]',
        border: 'border-[#34D399]/60',
        text: 'text-[#042F2E]',
        accent: 'text-[#064E3B]',
        hexBg: '#10B981',
        hexBorder: '#34D399',
        hexText: '#042F2E',
        intensity: 'extreme',
      };
    } else if (abs >= 3.0) {
      return {
        bg: 'bg-[#059669]',
        border: 'border-[#10B981]/50',
        text: 'text-white',
        accent: 'text-emerald-100',
        hexBg: '#059669',
        hexBorder: '#10B981',
        hexText: '#FFFFFF',
        intensity: 'high',
      };
    } else if (abs >= 1.5) {
      return {
        bg: 'bg-[#047857]',
        border: 'border-[#059669]/50',
        text: 'text-white',
        accent: 'text-emerald-200',
        hexBg: '#047857',
        hexBorder: '#059669',
        hexText: '#FFFFFF',
        intensity: 'medium',
      };
    } else {
      return {
        bg: 'bg-[#064E3B]',
        border: 'border-[#047857]/60',
        text: 'text-emerald-100',
        accent: 'text-emerald-300',
        hexBg: '#064E3B',
        hexBorder: '#047857',
        hexText: '#ECFDF5',
        intensity: 'muted',
      };
    }
  } else if (changePercent < -0.05) {
    // Red spectrum
    if (abs >= 5.0) {
      return {
        bg: 'bg-[#EF4444]',
        border: 'border-[#F87171]/60',
        text: 'text-white',
        accent: 'text-red-100',
        hexBg: '#EF4444',
        hexBorder: '#F87171',
        hexText: '#FFFFFF',
        intensity: 'extreme',
      };
    } else if (abs >= 3.0) {
      return {
        bg: 'bg-[#DC2626]',
        border: 'border-[#EF4444]/50',
        text: 'text-white',
        accent: 'text-red-100',
        hexBg: '#DC2626',
        hexBorder: '#EF4444',
        hexText: '#FFFFFF',
        intensity: 'high',
      };
    } else if (abs >= 1.5) {
      return {
        bg: 'bg-[#B91C1C]',
        border: 'border-[#DC2626]/50',
        text: 'text-white',
        accent: 'text-red-200',
        hexBg: '#B91C1C',
        hexBorder: '#DC2626',
        hexText: '#FFFFFF',
        intensity: 'medium',
      };
    } else {
      return {
        bg: 'bg-[#7F1D1D]',
        border: 'border-[#991B1B]/60',
        text: 'text-red-100',
        accent: 'text-red-300',
        hexBg: '#7F1D1D',
        hexBorder: '#991B1B',
        hexText: '#FEF2F2',
        intensity: 'muted',
      };
    }
  } else {
    // Flat / Unchanged
    return {
      bg: 'bg-[#1E293B]',
      border: 'border-[#334155]',
      text: 'text-slate-300',
      accent: 'text-slate-400',
      hexBg: '#1E293B',
      hexBorder: '#334155',
      hexText: '#CBD5E1',
      intensity: 'neutral',
    };
  }
}
