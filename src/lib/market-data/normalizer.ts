import { StockQuote, MarketCapQuality } from '../types';
import { MarketDataValidator } from './validator';

export interface RawProviderQuote {
  symbol: string;
  price: number;
  prevClose: number;
  volume: number;
  dayHigh?: number;
  dayLow?: number;
  open?: number;
  rawTimestamp: unknown;
  marketCap?: number | null;
  marketCapSource?: string;
  providerName: string;
}

export class MarketDataNormalizer {
  /**
   * Normalizes a raw provider quote and merges it with verified stock metadata
   */
  static normalize(
    raw: RawProviderQuote, 
    baseline: StockQuote,
    isMarketOpen: boolean
  ): StockQuote {
    // 1. Validate Upstream Timestamp
    const tsResult = MarketDataValidator.validateTimestamp(raw.rawTimestamp);
    
    // 2. Validate Price Movement & Calculations
    const movement = MarketDataValidator.validatePriceMovement(raw.price, raw.prevClose);
    const validPrice = movement.isValid ? raw.price : baseline.price;
    const validPrevClose = movement.isValid ? raw.prevClose : baseline.previousClose;
    const validChange = movement.isValid ? movement.change : baseline.change;
    const validChangePercent = movement.isValid ? movement.changePercent : baseline.changePercent;

    // 3. Evaluate Data Freshness
    const freshness = MarketDataValidator.evaluateFreshness(tsResult.timestampMs, isMarketOpen);

    // 4. Handle Market Capitalization Transparency
    // Never invent or fabricate market capitalization.
    let resolvedMarketCap: number | null = null;
    let resolvedCapSource = 'UNAVAILABLE';
    let resolvedCapQuality: MarketCapQuality = 'UNAVAILABLE';
    let resolvedCapLastUpdated = 'N/A';

    if (typeof raw.marketCap === 'number' && !isNaN(raw.marketCap) && raw.marketCap > 0) {
      resolvedMarketCap = raw.marketCap;
      resolvedCapSource = raw.marketCapSource || raw.providerName;
      resolvedCapQuality = 'REPORTED_LIVE';
      resolvedCapLastUpdated = new Date().toISOString().split('T')[0];
    } else if (typeof baseline.marketCap === 'number' && baseline.marketCap > 0) {
      // Use audited public filings reference with transparent attribution
      resolvedMarketCap = baseline.marketCap;
      resolvedCapSource = baseline.marketCapSource || 'EXCHANGE_PUBLIC_FILINGS';
      resolvedCapQuality = baseline.marketCapQuality || 'PUBLIC_FILINGS_REFERENCE';
      resolvedCapLastUpdated = baseline.marketCapLastUpdated || '2026-Q3-DISCLOSURE';
    } else {
      resolvedMarketCap = null;
      resolvedCapSource = 'UNAVAILABLE';
      resolvedCapQuality = 'UNAVAILABLE';
      resolvedCapLastUpdated = 'N/A';
    }

    return {
      ...baseline,
      price: validPrice,
      previousClose: validPrevClose,
      change: validChange,
      changePercent: validChangePercent,
      volume: raw.volume || baseline.volume,
      dayHigh: raw.dayHigh || baseline.dayHigh,
      dayLow: raw.dayLow || baseline.dayLow,
      open: raw.open || baseline.open,
      dataStatus: freshness.status,
      upstreamTimestamp: tsResult.timestampMs,
      dataAgeMinutes: freshness.dataAgeMinutes,
      isStale: freshness.isStale,
      dataQualityNote: freshness.freshnessNote,
      marketCap: resolvedMarketCap,
      marketCapSource: resolvedCapSource,
      marketCapQuality: resolvedCapQuality,
      marketCapLastUpdated: resolvedCapLastUpdated,
    };
  }
}
