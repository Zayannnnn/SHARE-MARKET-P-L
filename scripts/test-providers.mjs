async function testProviders() {
  console.log('=== MARKET DATA API PROVIDER RIGOROUS AUDIT ===\n');

  // 1. Alpha Vantage
  console.log('1. Testing Alpha Vantage (GLOBAL_QUOTE demo)...');
  try {
    const res = await fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo', {
      headers: { 'User-Agent': 'MarketMap/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    console.log('Alpha Vantage Status:', res.status);
    console.log('Alpha Vantage Response Sample:', JSON.stringify(data).slice(0, 150));
    if (data['Global Quote']) {
      console.log('Alpha Vantage US Data: SUPPORTED');
    } else {
      console.log('Alpha Vantage Note:', data.Note || data.Information || 'Rate limit / Key needed');
    }
  } catch (e) {
    console.log('Alpha Vantage Error:', e.message);
  }

  // 1b. Alpha Vantage with NSE Symbol (RELIANCE.BSE or RELIANCE.NSE)
  console.log('\n1b. Testing Alpha Vantage for Indian Exchange (RELIANCE.BSE)...');
  try {
    const res = await fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.BSE&apikey=demo', {
      headers: { 'User-Agent': 'MarketMap/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    console.log('Alpha Vantage India Response:', JSON.stringify(data).slice(0, 150));
  } catch (e) {
    console.log('Alpha Vantage India Error:', e.message);
  }

  // 2. Twelve Data
  console.log('\n2. Testing Twelve Data (Demo / Without Key)...');
  try {
    const res = await fetch('https://api.twelvedata.com/quote?symbol=AAPL&apikey=demo', {
      headers: { 'User-Agent': 'MarketMap/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    console.log('Twelve Data US Status:', res.status);
    console.log('Twelve Data US Sample:', JSON.stringify(data).slice(0, 150));
  } catch (e) {
    console.log('Twelve Data US Error:', e.message);
  }

  // 2b. Twelve Data NSE/BSE
  console.log('\n2b. Testing Twelve Data for NSE (RELIANCE:NSE)...');
  try {
    const res = await fetch('https://api.twelvedata.com/quote?symbol=RELIANCE&exchange=NSE&apikey=demo', {
      headers: { 'User-Agent': 'MarketMap/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    console.log('Twelve Data NSE Sample:', JSON.stringify(data).slice(0, 150));
  } catch (e) {
    console.log('Twelve Data NSE Error:', e.message);
  }

  // 3. Stooq (Free financial data provider)
  console.log('\n3. Testing Stooq CSV/JSON for US (AAPL.US)...');
  try {
    const res = await fetch('https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv', {
      headers: { 'User-Agent': 'MarketMap/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    const text = await res.text();
    console.log('Stooq US Status:', res.status);
    console.log('Stooq US Sample:', text.trim());
  } catch (e) {
    console.log('Stooq US Error:', e.message);
  }

  // 4. Yahoo Finance query endpoints
  console.log('\n4. Testing Yahoo Finance Query API for US (NVDA)...');
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/NVDA?interval=1d&range=1d', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Yahoo Finance US Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      console.log('Yahoo US RegularMarketPrice:', meta?.regularMarketPrice);
      console.log('Yahoo US PreviousClose:', meta?.chartPreviousClose);
    } else {
      const err = await res.text();
      console.log('Yahoo US Response Body:', err.slice(0, 120));
    }
  } catch (e) {
    console.log('Yahoo US Error:', e.message);
  }

  // 4b. Yahoo Finance query for Indian NSE (RELIANCE.NS)
  console.log('\n4b. Testing Yahoo Finance Query API for NSE (RELIANCE.NS)...');
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS?interval=1d&range=1d', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Yahoo Finance NSE Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      console.log('Yahoo NSE RegularMarketPrice:', meta?.regularMarketPrice);
      console.log('Yahoo NSE PreviousClose:', meta?.chartPreviousClose);
    } else {
      const err = await res.text();
      console.log('Yahoo NSE Response Body:', err.slice(0, 120));
    }
  } catch (e) {
    console.log('Yahoo NSE Error:', e.message);
  }

  // 4c. Yahoo Finance query for Indian BSE (RELIANCE.BO)
  console.log('\n4c. Testing Yahoo Finance Query API for BSE (RELIANCE.BO)...');
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.BO?interval=1d&range=1d', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Yahoo Finance BSE Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      console.log('Yahoo BSE RegularMarketPrice:', meta?.regularMarketPrice);
      console.log('Yahoo BSE PreviousClose:', meta?.chartPreviousClose);
    } else {
      const err = await res.text();
      console.log('Yahoo BSE Response Body:', err.slice(0, 120));
    }
  } catch (e) {
    console.log('Yahoo BSE Error:', e.message);
  }

  console.log('\n=== END OF PROVIDER AUDIT ===');
}

testProviders();
