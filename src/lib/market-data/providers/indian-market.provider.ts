import { ProviderHealthStatus } from '../../types';
import { RawProviderQuote } from '../normalizer';
import { ProviderResult } from './twelve-data.provider';

export interface IIndianMarketDataProvider {
  readonly name: string;
  readonly isUnofficialDevSource: boolean;
  readonly commercialNotice: string;
  fetchQuotes(symbols: { symbol: string; exchange: 'NSE' | 'BSE' }[]): Promise<ProviderResult>;
}

/**
 * Developer Adapter for Indian Markets (NSE & BSE)
 * 
 * DISCLAIMER & REGULATORY NOTICE:
 * Uses public chart query infrastructure exclusively for private development testing.
 * NOT an authorized commercial data feed.
 * Carries no official SEBI or NSE/BSE data redistribution license.
 * Designed as an adapter that can be replaced with an authorized commercial vendor
 * (e.g., TrueData, GlobalDataFeeds, Refinitiv, or NSE Data & Analytics).
 */
export class IndianMarketDataProvider implements IIndianMarketDataProvider {
  public readonly name = 'Yahoo Finance Unofficial Dev Adapter (NSE/BSE)';
  public readonly isUnofficialDevSource = true;
  public readonly commercialNotice = 
    'UNOFFICIAL SOURCE: Exclusively for local private development testing. Not an authorized commercial exchange feed. No commercial redistribution rights. Market cap is not supplied by this endpoint.';

  /**
   * Fetches quotes for Indian symbols using exchange-specific suffixes (.NS and .BO)
   */
  async fetchQuotes(
    symbols: { symbol: string; exchange: 'NSE' | 'BSE' }[]
  ): Promise<ProviderResult> {
    const results: Record<string, RawProviderQuote> = {};
    let detectedHealth: ProviderHealthStatus = 'CONNECTED';
    let healthDetails = 'Connected to unofficial developer chart endpoint (15-min delayed private testing)';

    // Process in batches of 6
    const chunks: { symbol: string; exchange: 'NSE' | 'BSE' }[][] = [];
    const chunkSize = 6;
    for (let i = 0; i < symbols.length; i += chunkSize) {
      chunks.push(symbols.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async ({ symbol, exchange }) => {
        const yahooSym = exchange === 'NSE' ? `${symbol}.NS` : `${symbol}.BO`;
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=5d`;
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(3500),
          });

          if (!res.ok) {
            if (res.status === 429) {
              detectedHealth = 'RATE_LIMITED';
              healthDetails = 'Upstream query endpoint rate limit reached';
            }
            return;
          }

          const json = await res.json();
          const meta = json.chart?.result?.[0]?.meta;

          if (meta && typeof meta.regularMarketPrice === 'number' && typeof meta.chartPreviousClose === 'number') {
            // meta.regularMarketTime is in UNIX seconds
            const rawTs = meta.regularMarketTime ? meta.regularMarketTime * 1000 : null;

            results[symbol] = {
              symbol,
              price: Number(meta.regularMarketPrice.toFixed(2)),
              prevClose: Number(meta.chartPreviousClose.toFixed(2)),
              volume: meta.regularMarketVolume || 0,
              dayHigh: meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh.toFixed(2)) : undefined,
              dayLow: meta.regularMarketDayLow ? Number(meta.regularMarketDayLow.toFixed(2)) : undefined,
              rawTimestamp: rawTs,
              marketCap: null, // Endpoint does NOT provide marketCap; never invent fake numbers
              marketCapSource: 'UNAVAILABLE',
              providerName: this.name,
            };
          }
        } catch {
          // Graceful symbol isolation
        }
      });

      await Promise.allSettled(promises);
    }

    if (Object.keys(results).length === 0 && detectedHealth === 'CONNECTED') {
      detectedHealth = 'UNAVAILABLE';
      healthDetails = 'Unofficial Indian developer endpoint unreachable or timed out';
    }

    return {
      quotes: results,
      health: detectedHealth,
      healthDetails,
    };
  }
}
