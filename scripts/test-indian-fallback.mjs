const indianSymbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'];

async function inspectIndianFallback() {
  console.log('=== TASK 3: INDIAN MARKET FALLBACK RIGOROUS INSPECTION ===');
  console.log('Target Symbols: RELIANCE.NS, TCS.NS, HDFCBANK.NS, INFY.NS');
  console.log('Endpoint: https://query1.finance.yahoo.com/v8/finance/chart/{symbol}');

  for (const sym of indianSymbols) {
    console.log(`\n------------------------------------------------`);
    console.log(`Testing Symbol: ${sym}`);
    console.log(`------------------------------------------------`);

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=5d`;
      const t0 = Date.now();
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(6000)
      });
      const latency = Date.now() - t0;

      if (!res.ok) {
        console.log(`[HTTP ERROR] Status ${res.status}`);
        continue;
      }

      const json = await res.json();
      const meta = json.chart?.result?.[0]?.meta;
      const timestamps = json.chart?.result?.[0]?.timestamp || [];

      console.log(`Status:            HTTP ${res.status} OK (${latency}ms)`);
      console.log(`Exchange Name:     ${meta?.exchangeName}`);
      console.log(`Exchange Timezone: ${meta?.exchangeTimezoneName} (${meta?.timezone})`);
      console.log(`Currency:          ${meta?.currency}`);
      console.log(`Current Price:     ${meta?.regularMarketPrice}`);
      console.log(`Previous Close:    ${meta?.chartPreviousClose}`);
      console.log(`Calculated Change: ${(meta?.regularMarketPrice - meta?.chartPreviousClose).toFixed(2)}`);
      console.log(`Calculated Pct:    ${(((meta?.regularMarketPrice - meta?.chartPreviousClose) / meta?.chartPreviousClose) * 100).toFixed(2)}%`);
      console.log(`Day High / Low:    ${meta?.regularMarketDayHigh} / ${meta?.regularMarketDayLow}`);
      console.log(`Trading Volume:    ${meta?.regularMarketVolume?.toLocaleString() || 'N/A'}`);
      console.log(`Market Cap in Meta?: ${meta?.marketCap ? meta.marketCap : 'NOT PROVIDED in chart endpoint'}`);
      console.log(`Historical Bars:   ${timestamps.length} session bars`);
    } catch (err) {
      console.log(`[ERROR] ${sym}: ${err.message}`);
    }
  }

  console.log('\n=== TASK 3 INSPECTION COMPLETE ===');
}

inspectIndianFallback();
