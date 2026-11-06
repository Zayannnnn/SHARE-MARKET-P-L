import { StockDataStatus } from '../types';

export interface TimestampValidationResult {
  valid: boolean;
  timestampMs: number | null;
  error?: string;
}

export interface FreshnessValidationResult {
  dataAgeMinutes: number | null;
  isStale: boolean;
  status: StockDataStatus;
  freshnessNote: string;
}

export class MarketDataValidator {
  /**
   * Validates and sanitizes raw upstream timestamps.
   * Rejects NaN, negative, zero, or improbable future timestamps (>24h in future).
   */
  static validateTimestamp(rawTimestamp: unknown): TimestampValidationResult {
    if (rawTimestamp === null || rawTimestamp === undefined) {
      return { valid: false, timestampMs: null, error: 'Timestamp is missing' };
    }

    let ms: number;
    if (typeof rawTimestamp === 'number') {
      // Check if UNIX seconds (10 digits) or milliseconds (13 digits)
      ms = rawTimestamp < 10000000000 ? rawTimestamp * 1000 : rawTimestamp;
    } else if (typeof rawTimestamp === 'string') {
      const parsed = Date.parse(rawTimestamp);
      if (isNaN(parsed)) {
        return { valid: false, timestampMs: null, error: `Malformed timestamp string: "${rawTimestamp}"` };
      }
      ms = parsed;
    } else {
      return { valid: false, timestampMs: null, error: 'Unrecognized timestamp format' };
    }

    if (isNaN(ms) || ms <= 0) {
      return { valid: false, timestampMs: null, error: 'Invalid numeric timestamp value' };
    }

    // Reject future timestamps more than 24h ahead
    const now = Date.now();
    if (ms > now + 24 * 60 * 60 * 1000) {
      return { valid: false, timestampMs: null, error: 'Timestamp is from the future' };
    }

    return { valid: true, timestampMs: ms };
  }

  /**
   * Calculates actual data age and determines freshness classification.
   * Never assumes a 20-second cache means underlying market data is 20 seconds old.
   */
  static evaluateFreshness(
    timestampMs: number | null, 
    isMarketOpen: boolean,
    isHistoricalView: boolean = false
  ): FreshnessValidationResult {
    if (isHistoricalView) {
      return {
        dataAgeMinutes: null,
        isStale: false,
        status: 'HISTORICAL',
        freshnessNote: 'Historical timeframe horizon quote',
      };
    }

    if (!timestampMs) {
      return {
        dataAgeMinutes: null,
        isStale: true,
        status: 'SAMPLE DATA',
        freshnessNote: 'No verified upstream timestamp available',
      };
    }

    const now = Date.now();
    const dataAgeMinutes = Math.max(0, Math.round((now - timestampMs) / 60000));

    if (!isMarketOpen) {
      return {
        dataAgeMinutes,
        isStale: false,
        status: 'PREVIOUS CLOSE',
        freshnessNote: `Session closed • Closing price recorded ~${dataAgeMinutes}m ago`,
      };
    }

    // During active market hours:
    // Twelve Data Basic & Yahoo Finance provide ~15-minute delayed quotes
    if (dataAgeMinutes <= 30) {
      return {
        dataAgeMinutes,
        isStale: false,
        status: 'DELAYED',
        freshnessNote: `15-min delayed quote (${dataAgeMinutes}m old)`,
      };
    } else {
      return {
        dataAgeMinutes,
        isStale: true,
        status: 'DELAYED',
        freshnessNote: `Stale active quote: latency exceeds threshold (${dataAgeMinutes}m old)`,
      };
    }
  }

  /**
   * Validates mathematical calculations for price, previous close, and percentage change.
   */
  static validatePriceMovement(price: number, previousClose: number): {
    change: number;
    changePercent: number;
    isValid: boolean;
  } {
    if (typeof price !== 'number' || isNaN(price) || price <= 0 ||
        typeof previousClose !== 'number' || isNaN(previousClose) || previousClose <= 0) {
      return { change: 0, changePercent: 0, isValid: false };
    }

    const change = Number((price - previousClose).toFixed(2));
    const changePercent = Number((((price - previousClose) / previousClose) * 100).toFixed(2));

    return { change, changePercent, isValid: true };
  }
}
