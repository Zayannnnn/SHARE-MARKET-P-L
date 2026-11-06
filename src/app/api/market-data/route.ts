import { NextRequest, NextResponse } from 'next/server';
import { getMarketData, checkRateLimit } from '@/lib/market-data-service';
import { Market, Exchange, TimePeriod } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // 1. IP Rate Limiting Security Protection
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';

    const { allowed, remaining } = checkRateLimit(clientIp);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait 60 seconds before sending additional requests.',
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    // 2. Query Parameter Validation
    const searchParams = request.nextUrl.searchParams;
    const market = (searchParams.get('market')?.toUpperCase() || 'INDIA') as Market;
    const exchange = (searchParams.get('exchange')?.toUpperCase() || 'ALL') as Exchange;
    const period = (searchParams.get('period')?.toUpperCase() || '1D') as TimePeriod;
    const refresh = searchParams.get('refresh') === 'true';

    if (market !== 'INDIA' && market !== 'USA') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid market: ${market}. Valid options are 'INDIA' or 'USA'.` 
        },
        { status: 400 }
      );
    }

    const validExchanges = market === 'INDIA' 
      ? ['ALL', 'NSE', 'BSE'] 
      : ['ALL', 'NASDAQ', 'NYSE'];

    if (!validExchanges.includes(exchange)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid exchange '${exchange}' for market '${market}'. Supported exchanges: ${validExchanges.join(', ')}.` 
        },
        { status: 400 }
      );
    }

    // 3. Retrieve Data through Dedicated Service Layer
    const data = await getMarketData(market, exchange, period, refresh);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      {
        success: false,
        error: 'Market Data Service failure',
        details: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
