const testSymbols = [
  { symbol: 'NVDA', exchange: 'NASDAQ', market: 'USA' },
  { symbol: 'AAPL', exchange: 'NASDAQ', market: 'USA' },
  { symbol: 'JPM', exchange: 'NYSE', market: 'USA' },
  { symbol: 'RELIANCE.NS', exchange: 'NSE', market: 'INDIA' },
  { symbol: 'TCS.NS', exchange: 'NSE', market: 'INDIA' },
  { symbol: 'HDFCBANK.NS', exchange: 'NSE', market: 'INDIA' },
  { symbol: 'HINDUNILVR.BO', exchange: 'BSE', market: 'INDIA' },
  { symbol: 'MARUTI.BO', exchange: 'BSE', market: 'INDIA' },
];

async function testBatch() {
  console.log('Testing Yahoo Finance chart API for US & Indian exchanges...\n');

  for (const item of testSymbols) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d&range=5d`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!res.ok) {
        console.log(`[FAIL] ${item.symbol}: HTTP ${res.status}`);
        continue;
      }

      const json = await res.json();
      const meta = json.chart?.result?.[0]?.meta;
      const timestamps = json.chart?.result?.[0]?.timestamp || [];
      const quotes = json.chart?.result?.[0]?.indicators?.quote?.[0] || {};

      const price = meta?.regularMarketPrice;
      const prevClose = meta?.chartPreviousClose;
      const change = Number((price - prevClose).toFixed(2));
      const changePct = Number((((price - prevClose) / prevClose) * 100).toFixed(2));
      const volume = meta?.regularMarketVolume;
      const currency = meta?.currency;
      const exchangeName = meta?.exchangeName;

      console.log(`[PASS] ${item.symbol} (${item.exchange}):`);
      console.log(`       Price: ${currency} ${price} | PrevClose: ${prevClose} | Change: ${change} (${changePct}%)`);
      console.log(`       Volume: ${volume?.toLocaleString() || 'N/A'} | ExchangeName: ${exchangeName} | DataPoints: ${timestamps.length}`);
    } catch (err) {
      console.log(`[ERR]  ${item.symbol}: ${err.message}`);
    }
  }
}

testBatch();
