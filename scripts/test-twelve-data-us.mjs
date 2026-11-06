import fs from 'fs';

// Read API key securely from .env.local without logging it
let apiKey = process.env.TWELVE_DATA_API_KEY;
if (!apiKey && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf-8');
  const match = content.match(/TWELVE_DATA_API_KEY=(.+)/);
  if (match) apiKey = match[1].trim();
}

function mask(key) {
  if (!key) return '[MISSING]';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

console.log('=== TASK 2: TWELVE DATA REST API VERIFICATION (US EQUITIES) ===');
console.log('Provider: Twelve Data REST API');
console.log('Transport: HTTPS REST Polling (NOT WebSocket streaming)');
console.log('Key Configured:', mask(apiKey));

const symbols = ['AAPL', 'MSFT', 'NVDA'];

async function testTwelveData() {
  const nowUtc = Date.now();

  for (const sym of symbols) {
    console.log(`\n----------------------------------------`);
    console.log(`Testing Symbol: ${sym}`);
    console.log(`----------------------------------------`);

    try {
      const url = `https://api.twelvedata.com/quote?symbol=${sym}&apikey=${apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const data = await res.json();

      if (data.code && data.code !== 200) {
        console.log(`[ERROR] Twelve Data error for ${sym}:`, data.message || `Code ${data.code}`);
        continue;
      }

      const price = parseFloat(data.close || data.latest_price);
      const prevClose = parseFloat(data.previous_close);
      const change = parseFloat(data.change);
      const pctChange = parseFloat(data.percent_change);
      const quoteTimestampSec = parseInt(data.timestamp, 10);
      const quoteTime = new Date(quoteTimestampSec * 1000);
      const ageMinutes = Math.round((nowUtc - quoteTime.getTime()) / (60 * 1000));

      console.log(`[RAW RESPONSE FIELDS]`);
      console.log(`  Symbol:          ${data.symbol}`);
      console.log(`  Name:            ${data.name}`);
      console.log(`  Exchange:        ${data.exchange} (${data.mic_code})`);
      console.log(`  Currency:        ${data.currency}`);
      console.log(`  Datetime:        ${data.datetime}`);
      console.log(`  Timestamp (UNIX):${data.timestamp} (${quoteTime.toISOString()})`);
      console.log(`  Market Open?:    ${data.is_market_open}`);
      console.log(`  Current Price:   ${price}`);
      console.log(`  Previous Close:  ${prevClose}`);
      console.log(`  Absolute Change: ${change}`);
      console.log(`  Percent Change:  ${pctChange}%`);
      console.log(`  Data Freshness:  Quote timestamp is ~${ageMinutes} mins ago (Market state: ${data.is_market_open ? 'OPEN' : 'CLOSED'})`);
    } catch (err) {
      console.log(`[HTTP ERROR] ${sym}: ${err.message}`);
    }
  }
}

testTwelveData();
