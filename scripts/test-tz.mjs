function testTimezones() {
  const now = new Date();
  
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const etFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  console.log('Current UTC:', now.toISOString());
  console.log('India (Asia/Kolkata):', istFormatter.format(now));
  console.log('USA (America/New_York):', etFormatter.format(now));
}

testTimezones();
