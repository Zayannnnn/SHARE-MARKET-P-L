import { ProviderHealthStatus } from '../../types';
import { RawProviderQuote } from '../normalizer';

export interface ProviderResult {
  quotes: Record<string, RawProviderQuote>;
  health: ProviderHealthStatus;
  healthDetails: string;
}

export class TwelveDataProvider {
  public readonly name = 'Twelve Data REST Provider';
  public readonly isUnofficialDevSource = false;
  public readonly commercialNotice = 
    'Twelve Data standard terms apply. Basic tier restricted to 8 requests/minute and 15-minute delayed US equities.';

  private apiKey: string | null = null;

  constructor(apiKey?: string | null) {
    this.apiKey = apiKey || process.env.TWELVE_DATA_API_KEY || null;
  }

  /**
   * Fetches US stock quotes via Twelve Data HTTPS REST API
   */
  async fetchQuotes(symbols: string[]): Promise<ProviderResult> {
    const results: Record<string, RawProviderQuote> = {};

    if (!this.apiKey) {
      return {
        quotes: {},
        health: 'INVALID_API_KEY',
        healthDetails: 'TWELVE_DATA_API_KEY is not configured in .env.local',
      };
    }

    let detectedHealth: ProviderHealthStatus = 'CONNECTED';
    let healthDetails = 'Connected to Twelve Data REST endpoint (15-min delayed free tier)';

    // Chunk symbols into groups of 6 to respect connection limits
    const chunks: string[][] = [];
    const chunkSize = 6;
    for (let i = 0; i < symbols.length; i += chunkSize) {
      chunks.push(symbols.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async (rawSym) => {
        try {
          const sym = rawSym === 'BRK.B' ? 'BRK/B' : rawSym;
          const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(sym)}&apikey=${this.apiKey}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
          
          if (!res.ok) {
            if (res.status === 429) {
              detectedHealth = 'RATE_LIMITED';
              healthDetails = 'Twelve Data rate limit reached (8 requests/min ceiling)';
            }
            return;
          }

          const data = await res.json();

          if (data.code) {
            if (data.code === 401) {
              detectedHealth = 'INVALID_API_KEY';
              healthDetails = `Twelve Data authentication error: ${data.message || 'Invalid API Key'}`;
            } else if (data.code === 429) {
              detectedHealth = 'RATE_LIMITED';
              healthDetails = 'Twelve Data free plan rate limit exceeded';
            } else if (data.code === 400 && data.message?.includes('plan')) {
              detectedHealth = 'UNSUPPORTED_EXCHANGE';
              healthDetails = `Exchange tier limit: ${data.message}`;
            }
            return;
          }

          const price = parseFloat(data.close || data.latest_price);
          const prevClose = parseFloat(data.previous_close);

          if (!isNaN(price) && !isNaN(prevClose) && prevClose > 0) {
            // Twelve Data timestamp is UNIX seconds
            const rawTs = data.timestamp ? parseInt(data.timestamp, 10) * 1000 : Date.now();

            results[rawSym] = {
              symbol: rawSym,
              price: Number(price.toFixed(2)),
              prevClose: Number(prevClose.toFixed(2)),
              volume: parseInt(data.volume, 10) || 0,
              dayHigh: data.high ? Number(parseFloat(data.high).toFixed(2)) : undefined,
              dayLow: data.low ? Number(parseFloat(data.low).toFixed(2)) : undefined,
              open: data.open ? Number(parseFloat(data.open).toFixed(2)) : undefined,
              rawTimestamp: rawTs,
              marketCap: null, // Twelve Data basic quote endpoint does not return marketCap
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
      healthDetails = 'Twelve Data API endpoint unreachable or timed out';
    }

    return {
      quotes: results,
      health: detectedHealth,
      healthDetails,
    };
  }
}
