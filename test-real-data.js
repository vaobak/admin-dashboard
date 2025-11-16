// Test dengan data real
const testData = 'Tre | 9WYNH533JA | 1 Tahun | 354159398087b978 | Xiaomi 2306EPN60G | Android 15 (API 35) | 16 November 2025';

console.log('Testing with real data:');
console.log('Input:', testData);
console.log('');

// Split by pipe
const parts = testData.split('|').map(p => p.trim());
console.log('Parts count:', parts.length);
console.log('Parts:', parts);
console.log('');

// Parse
const parsed = {
  id: 0,
  userName: parts[0] || '',
  licenseKey: parts[1] || '',
  masaAktif: parts[2] || '',
  deviceId: parts[3] || '',
  device: parts[4] || '',
  androidVersion: parts[5] || '',
  aktivasiPertama: parts[6] || ''
};

console.log('Parsed object:');
console.log(JSON.stringify(parsed, null, 2));
