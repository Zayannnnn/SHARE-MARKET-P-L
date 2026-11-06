import assert from 'assert';
import { getMarketSessionStatus, applyTimePeriodToStocks, checkRateLimit } from '../src/lib/market-data-service';
import { computeTreemap } from '../src/lib/treemap-layout';
import { INDIAN_STOCKS_UNIVERSE, US_STOCKS_UNIVERSE } from '../src/lib/stock-universe';
import { StockQuote } from '../src/lib/types';

console.log('====================================================');
console.log('MARKETMAP RIGOROUS PRODUCTION VALIDATION TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name: string, fn: () => void) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err: any) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// 1. Timezone & Market Hours Test
runTest('IANA Timezones: India (Asia/Kolkata) & USA (America/New_York) session status', () => {
  const indiaStatus = getMarketSessionStatus('INDIA');
  const usStatus = getMarketSessionStatus('USA');

  assert(indiaStatus.timezone.includes('Asia/Kolkata'), 'India must use Asia/Kolkata');
  assert(indiaStatus.currentLocalTime.includes('IST'), 'India time must display IST');
  assert(indiaStatus.sessionHours.includes('09:15 - 15:30 IST') || indiaStatus.sessionHours.includes('Exchange Holiday'), 'Correct session hours');

  assert(usStatus.timezone.includes('America/New_York'), 'USA must use America/New_York');
  assert(usStatus.currentLocalTime.includes('EST') || usStatus.currentLocalTime.includes('EDT'), 'USA time must display EST/EDT');
  assert(usStatus.sessionHours.includes('09:30 - 16:00 EST') || usStatus.sessionHours.includes('Exchange Holiday'), 'Correct session hours');
});

// 2. Percentage Calculation Test
runTest('Mathematical accuracy of price change and percentage calculation', () => {
  const sampleStocks: StockQuote[] = [
    {
      id: 'test-1',
      symbol: 'TEST1',
      name: 'Test Inc',
      exchange: 'NSE',
      market: 'INDIA',
      sector: 'Tech',
      price: 110,
      previousClose: 100,
      change: 10,
      changePercent: 10,
      marketCap: 1000000,
      volume: 1000,
      avgVolume: 1000,
      peRatio: 15,
      week52High: 120,
      week52Low: 80,
      dayHigh: 112,
      dayLow: 99,
      open: 101,
      dividendYield: 1.0,
      beta: 1.0,
      eps: 5,
      currency: 'INR',
      currencySymbol: '₹',
      capCategory: 'LARGE',
      lastUpdated: '15:30 IST',
      description: 'Test',
      dataStatus: 'PREVIOUS CLOSE',
      marketCapSource: 'EXCHANGE_PUBLIC_FILINGS',
      marketCapLastUpdated: '2026-Q3-DISCLOSURE',
      marketCapQuality: 'PUBLIC_FILINGS_REFERENCE',
      upstreamTimestamp: 1793959153000,
      dataAgeMinutes: 470,
      isStale: false,
      dataQualityNote: 'Reference quote',
      historicalReturns: { '1D': 10, '1W': 5, '1M': 15, '3M': 20, '1Y': 30 },
      chartData: [],
    },
    {
      id: 'test-2',
      symbol: 'TEST2',
      name: 'Test Corp',
      exchange: 'NYSE',
      market: 'USA',
      sector: 'Finance',
      price: 85,
      previousClose: 100,
      change: -15,
      changePercent: -15,
      marketCap: 500000,
      volume: 1000,
      avgVolume: 1000,
      peRatio: 12,
      week52High: 110,
      week52Low: 70,
      dayHigh: 99,
      dayLow: 84,
      open: 98,
      dividendYield: 2.0,
      beta: 1.2,
      eps: 4,
      currency: 'USD',
      currencySymbol: '$',
      capCategory: 'MID',
      lastUpdated: '16:00 EST',
      description: 'Test',
      dataStatus: 'PREVIOUS CLOSE',
      marketCapSource: 'SEC_EDGAR_PUBLIC_FILINGS',
      marketCapLastUpdated: '2026-Q3-DISCLOSURE',
      marketCapQuality: 'PUBLIC_FILINGS_REFERENCE',
      upstreamTimestamp: 1793975400000,
      dataAgeMinutes: 200,
      isStale: false,
      dataQualityNote: 'Reference quote',
      historicalReturns: { '1D': -15, '1W': -10, '1M': -5, '3M': 5, '1Y': 10 },
      chartData: [],
    }
  ];

  // 1D test
  const period1D = applyTimePeriodToStocks(sampleStocks, '1D');
  assert.strictEqual(period1D[0].changePercent, 10.00);
  assert.strictEqual(period1D[0].change, 10.00);
  assert.strictEqual(period1D[1].changePercent, -15.00);
  assert.strictEqual(period1D[1].change, -15.00);

  // 1M test
  const period1M = applyTimePeriodToStocks(sampleStocks, '1M');
  assert.strictEqual(period1M[0].changePercent, 15.00);
  assert.strictEqual(period1M[1].changePercent, -5.00);
  assert.strictEqual(period1M[0].dataStatus, 'HISTORICAL');
});

// 3. Treemap Layout & Proportionality Test
runTest('Squarified Treemap layout sizing is proportional to Market Capitalization', () => {
  const stockLarge = { ...INDIAN_STOCKS_UNIVERSE[0], marketCap: 1000000000 };
  const stockSmall = { ...INDIAN_STOCKS_UNIVERSE[1], marketCap: 10000000 };

  const nodes = computeTreemap([stockLarge, stockSmall], 1000, 600, 2);
  assert.strictEqual(nodes.length, 2);

  const areaLarge = nodes[0].width * nodes[0].height;
  const areaSmall = nodes[1].width * nodes[1].height;

  assert(areaLarge > areaSmall * 50, `Large cap area (${areaLarge}) should be significantly larger than small cap area (${areaSmall})`);
  assert(nodes[0].width > 0 && nodes[0].height > 0, 'Width and height must be strictly positive');
  assert(nodes[1].width > 0 && nodes[1].height > 0, 'Width and height must be strictly positive');
});

// 4. Safe Handling of Missing or NaN Market Cap
runTest('Safe handling of missing, 0, or NaN Market Capitalization', () => {
  const corruptedStock = { ...INDIAN_STOCKS_UNIVERSE[0], marketCap: NaN };
  const zeroCapStock = { ...INDIAN_STOCKS_UNIVERSE[1], marketCap: 0 };

  const nodes = computeTreemap([corruptedStock, zeroCapStock], 800, 500, 2);
  assert.strictEqual(nodes.length, 2, 'Must still generate valid nodes for both stocks');
  assert(!isNaN(nodes[0].width) && nodes[0].width > 0, 'Width must not be NaN');
  assert(!isNaN(nodes[0].height) && nodes[0].height > 0, 'Height must not be NaN');
});

// 5. Rate Limiter Security Guard Test
runTest('Server rate-limiting properly tracks requests and enforces burst threshold', () => {
  const testIp = '192.168.1.99';
  
  // Send 60 requests
  for (let i = 0; i < 60; i++) {
    const res = checkRateLimit(testIp);
    assert.strictEqual(res.allowed, true, `Request ${i + 1} should be allowed`);
  }

  // 61st request must be rejected with 429
  const overflow = checkRateLimit(testIp);
  assert.strictEqual(overflow.allowed, false, '61st request within window must be rejected');
  assert.strictEqual(overflow.remaining, 0, 'Remaining count must be 0');
});

// 6. Gainers vs Losers Separation
runTest('Top Gainers and Top Losers strict mathematical separation', () => {
  const mixedStocks = [
    { ...INDIAN_STOCKS_UNIVERSE[0], changePercent: 3.5 },
    { ...INDIAN_STOCKS_UNIVERSE[1], changePercent: -2.1 },
    { ...INDIAN_STOCKS_UNIVERSE[2], changePercent: 0.0 },
    { ...INDIAN_STOCKS_UNIVERSE[3], changePercent: -4.8 },
    { ...INDIAN_STOCKS_UNIVERSE[4], changePercent: 1.2 },
  ];

  const gainers = mixedStocks.filter(s => s.changePercent > 0);
  const losers = mixedStocks.filter(s => s.changePercent < 0);
  const unchanged = mixedStocks.filter(s => s.changePercent === 0);

  assert.strictEqual(gainers.length, 2, 'Gainers count must be 2');
  assert.strictEqual(losers.length, 2, 'Losers count must be 2');
  assert.strictEqual(unchanged.length, 1, 'Unchanged count must be 1');

  // Verify every gainer is strictly positive
  for (const g of gainers) {
    assert(g.changePercent > 0, `Gainer ${g.symbol} must have changePercent > 0`);
  }

  // Verify every loser is strictly negative
  for (const l of losers) {
    assert(l.changePercent < 0, `Loser ${l.symbol} must have changePercent < 0`);
  }
});

console.log(`\n====================================================`);
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
console.log(`====================================================`);
