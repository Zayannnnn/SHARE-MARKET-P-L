'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Market, 
  Exchange, 
  MarketView, 
  TimePeriod, 
  CapCategory, 
  SortBy, 
  StockQuote, 
  MarketDataResponse 
} from '@/lib/types';
import { Header } from '@/components/Header';
import { MarketTickerTape } from '@/components/MarketTickerTape';
import { MarketNavigation } from '@/components/MarketNavigation';
import { FilterToolbar } from '@/components/FilterToolbar';
import { TreemapContainer } from '@/components/Heatmap/TreemapContainer';
import { StockDrawer } from '@/components/StockDrawer';
import { StockHoverCard } from '@/components/StockHoverCard';
import { SearchDialog } from '@/components/SearchDialog';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  // Primary State
  const [market, setMarket] = useState<Market>('INDIA');
  const [exchange, setExchange] = useState<Exchange>('ALL');
  const [view, setView] = useState<MarketView>('GAINERS');
  const [period, setPeriod] = useState<TimePeriod>('1D');

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCap, setSelectedCap] = useState<CapCategory>('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('PERCENT_DESC');

  // Interactive Overlays
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [hoveredStock, setHoveredStock] = useState<{ stock: StockQuote; pos: { x: number; y: number } } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Data Loading & Auto-refresh
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState('Just now');

  // Fetch Market Data from API route
  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      setError(null);

      const params = new URLSearchParams({
        market,
        exchange,
        period,
        refresh: isManualRefresh ? 'true' : 'false',
      });

      const res = await fetch(`/api/market-data?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setMarketData(json.data);
        const tzSuffix = market === 'INDIA' ? 'IST' : 'EST';
        setLastUpdatedText(`${new Date().toLocaleTimeString('en-US', { hour12: false })} ${tzSuffix}`);
      } else {
        throw new Error(json.error || 'Failed to parse market feed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [market, exchange, period]);

  // Initial load and refetch on market, exchange, or period change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle market change (resets exchange to ALL and clears sector)
  const handleMarketChange = (newMarket: Market) => {
    setMarket(newMarket);
    setExchange('ALL');
    setSelectedSector('ALL');
    setSearchQuery('');
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 5s Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Filter and Sort Stocks
  const { filteredStocks, gainersCount, losersCount } = useMemo(() => {
    if (!marketData || !marketData.stocks) {
      return { filteredStocks: [], gainersCount: 0, losersCount: 0 };
    }

    const allStocks = marketData.stocks;
    const gCount = allStocks.filter(s => s.changePercent > 0).length;
    const lCount = allStocks.filter(s => s.changePercent < 0).length;

    let result = [...allStocks];

    // View filter: GAINERS vs LOSERS vs ALL
    if (view === 'GAINERS') {
      result = result.filter(s => s.changePercent > 0);
    } else if (view === 'LOSERS') {
      result = result.filter(s => s.changePercent < 0);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    // Market cap category filter
    if (selectedCap !== 'ALL') {
      result = result.filter(s => s.capCategory === selectedCap);
    }

    // Sector filter
    if (selectedSector !== 'ALL') {
      result = result.filter(s => s.sector === selectedSector);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'PERCENT_DESC') {
        return b.changePercent - a.changePercent;
      } else if (sortBy === 'PERCENT_ASC') {
        return a.changePercent - b.changePercent;
      } else if (sortBy === 'MARKET_CAP_DESC') {
        return (b.marketCap || 0) - (a.marketCap || 0);
      } else if (sortBy === 'VOLUME_DESC') {
        return b.volume - a.volume;
      }
      return 0;
    });

    return {
      filteredStocks: result,
      gainersCount: gCount,
      losersCount: lCount,
    };
  }, [marketData, view, searchQuery, selectedCap, selectedSector, sortBy]);

  // Check if filters are dirty
  const isFiltered = searchQuery !== '' || selectedCap !== 'ALL' || selectedSector !== 'ALL' || exchange !== 'ALL';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCap('ALL');
    setSelectedSector('ALL');
    setExchange('ALL');
    setSortBy('PERCENT_DESC');
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* 1. Header */}
      <Header
        currentMarket={market}
        onMarketChange={handleMarketChange}
        marketStatus={marketData?.marketStatus}
        feedStatus={marketData?.feedStatus}
        lastUpdatedText={lastUpdatedText}
        isRefreshing={refreshing}
        onRefresh={() => fetchData(true)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(prev => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Top Marquee Indices Tape */}
      <MarketTickerTape indices={marketData?.indices || []} />

      {/* 3. Market Navigation (Gainers/Losers Tabs & Exchanges) */}
      <MarketNavigation
        currentMarket={market}
        currentExchange={exchange}
        currentView={view}
        onMarketChange={handleMarketChange}
        onExchangeChange={setExchange}
        onViewChange={setView}
        gainersCount={gainersCount}
        losersCount={losersCount}
      />

      {/* 4. Filter Toolbar */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        selectedCap={selectedCap}
        onCapChange={setSelectedCap}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        sectors={marketData?.sectors || []}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
        totalVisible={filteredStocks.length}
      />

      {/* Error alert banner if API issue */}
      {error && (
        <div className="bg-rose-950/40 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-rose-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Market Data Service Notice: {error}. Switched to verified snapshot quotes.</span>
          </div>
          <button 
            onClick={() => fetchData(true)} 
            className="flex items-center gap-1 underline hover:text-white"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Feed</span>
          </button>
        </div>
      )}

      {/* 5. Main Treemap Visualization Workspace */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-slate-400 gap-3 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="text-xs tracking-wider uppercase">Loading {market} Market Heatmap Engine...</span>
          </div>
        ) : (
          <TreemapContainer
            stocks={filteredStocks}
            currentView={view}
            onSelectStock={(stock) => setSelectedStock(stock)}
            onHoverStock={(stock, e) => {
              setHoveredStock({ stock, pos: { x: e.clientX, y: e.clientY } });
            }}
            onLeaveStock={() => setHoveredStock(null)}
            onResetFilters={handleClearFilters}
          />
        )}
      </main>

      {/* 6. Floating Hover Card Tooltip */}
      <StockHoverCard
        stock={hoveredStock?.stock || null}
        position={hoveredStock?.pos || null}
      />

      {/* 7. Detailed Stock Information Slide-over Drawer */}
      <StockDrawer
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      {/* 8. Quick Search Dialog (Cmd+K) */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={marketData?.stocks || []}
        onSelectStock={(stock) => setSelectedStock(stock)}
      />

    </div>
  );
}
