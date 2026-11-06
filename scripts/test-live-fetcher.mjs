const symbols = ['RELIANCE.NS', 'TCS.NS', 'NVDA', 'AAPL', 'MSFT', 'HINDUNILVR.BO'];

async function fetchQuote(sym) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=5d`;
  const t0 = Date.now();
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    signal: AbortSignal.timeout(4000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const meta = json.chart?.result?.[0]?.meta;
  return {
    symbol: sym,
    price: meta?.regularMarketPrice,
    prevClose: meta?.chartPreviousClose,
    volume: meta?.regularMarketVolume,
    durationMs: Date.now() - t0,
  };
}

async function testParallel() {
  console.log('Testing parallel fetching of 6 symbols...');
  const t0 = Date.now();
  const results = await Promise.allSettled(symbols.map(s => fetchQuote(s)));
  console.log(`Finished in ${Date.now() - t0}ms:`);
  for (const r of results) {
    if (r.status === 'fulfilled') {
      console.log(`  ${r.value.symbol}: Price=${r.value.price}, PrevClose=${r.value.prevClose}, Vol=${r.value.volume} (${r.value.durationMs}ms)`);
    } else {
      console.log(`  Rejected: ${r.reason.message}`);
    }
  }
}

testParallel();
