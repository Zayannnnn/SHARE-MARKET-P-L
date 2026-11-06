export type Market = 'INDIA' | 'USA';

export type Exchange = 'ALL' | 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';

export type MarketView = 'GAINERS' | 'LOSERS' | 'ALL';

export type TimePeriod = '1D' | '1W' | '1M' | '3M' | '1Y';

export type CapCategory = 'ALL' | 'LARGE' | 'MID' | 'SMALL';

export type SortBy = 'PERCENT_DESC' | 'PERCENT_ASC' | 'MARKET_CAP_DESC' | 'VOLUME_DESC';

export type StockDataStatus = 'REAL-TIME' | 'DELAYED' | 'PREVIOUS CLOSE' | 'HISTORICAL' | 'SAMPLE DATA';

export type ProviderHealthStatus = 
  | 'CONNECTED' 
  | 'RATE_LIMITED' 
  | 'UNAVAILABLE' 
  | 'INVALID_API_KEY' 
  | 'UNSUPPORTED_EXCHANGE' 
  | 'STALE_DATA';

export type MarketCapQuality = 'REPORTED_LIVE' | 'PUBLIC_FILINGS_REFERENCE' | 'UNAVAILABLE';

export interface ChartPoint {
  date: string;
  price: number;
  volume: number;
}

export interface StockQuote {
  id: string;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  market: Market;
  sector: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCap: number | null; // in standard currency units (INR or USD), null if unavailable
  marketCapSource: string; // e.g. 'TWELVE_DATA_API', 'EXCHANGE_PUBLIC_FILINGS', 'UNAVAILABLE'
  marketCapLastUpdated: string;
  marketCapQuality: MarketCapQuality;
  volume: number;
  avgVolume: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  dividendYield: number; // percentage
  beta: number;
  eps: number;
  historicalReturns: Record<TimePeriod, number>;
  chartData: ChartPoint[];
  currency: 'INR' | 'USD';
  currencySymbol: '₹' | '$';
  capCategory: 'LARGE' | 'MID' | 'SMALL';
  lastUpdated: string;
  description: string;
  dataStatus: StockDataStatus;
  upstreamTimestamp: number | null; // Unix timestamp ms from provider
  dataAgeMinutes: number | null; // Age of underlying market quote
  isStale: boolean; // Flagged if data is older than threshold during active hours
  dataQualityNote: string; // Transparent note on data source & SLA
}

export interface MarketIndex {
  symbol: string;
  name: string;
  market: Market;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketStatus {
  isOpen: boolean;
  statusText: 'OPEN' | 'CLOSED' | 'PRE-MARKET' | 'AFTER-HOURS';
  timezone: string;
  currentLocalTime: string;
  sessionHours: string;
}

export interface DataFeedStatus {
  source: 'REAL_TIME_STREAM' | 'DELAYED_FEED' | 'PREVIOUS_CLOSE' | 'SAMPLE_DATA' | 'CACHED_FEED' | 'FALLBACK_ACCURATE' | 'LIVE_FEED';
  lastSyncTimestamp: number;
  latencyMs: number;
  isDelayed: boolean;
  delayedMinutes: number;
  statusNote: string;
  provider: string;
  providerHealth: ProviderHealthStatus;
  providerHealthDetails: string;
  isUnofficialDevSource: boolean;
  commercialNotice: string;
}

export interface MarketDataResponse {
  market: Market;
  exchange: Exchange;
  period: TimePeriod;
  stocks: StockQuote[];
  indices: MarketIndex[];
  marketStatus: MarketStatus;
  feedStatus: DataFeedStatus;
  sectors: string[];
}

export interface TreemapNode {
  stock: StockQuote;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
}
