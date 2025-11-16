// Test parser function
const parseGistContent = (content) => {
  if (!content || !content.trim()) return [];
  
  const lines = content.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    try {
      // Split by pipe and trim each part
      const parts = line.split('|').map(p => p.trim());
      
      // Format: Nama Pengguna | LICENSE_KEY | Masa Aktif | DEVICE_ID | MANUFACTURER MODEL | Android VERSION | Aktivasi Pertama
      // Minimal harus ada 3 field (userName, licenseKey, masaAktif)
      if (parts.length >= 3) {
        return {
          id: index,
          userName: parts[0] || '',
          licenseKey: parts[1] || '',
          masaAktif: parts[2] || '',
          deviceId: parts[3] || '',
          device: parts[4] || '',
          androidVersion: parts[5] || '',
          aktivasiPertama: parts[6] || ''
        };
      }
      
      console.warn(`Line ${index + 1} skipped: insufficient fields`, line);
      return null;
    } catch (error) {
      console.error(`Error parsing line ${index + 1}:`, error, line);
      return null;
    }
  }).filter(Boolean);
};

// Test case 1: Data awal (sebelum aktivasi)
console.log('=== Test 1: Data Awal (Sebelum Aktivasi) ===');
const test1 = 'andre | UMLJ7QW6TC | 1 Tahun |  |  |  | ';
const result1 = parseGistContent(test1);
console.log('Input:', test1);
console.log('Output:', JSON.stringify(result1, null, 2));
console.log('');

// Test case 2: Data setelah aktivasi
console.log('=== Test 2: Data Setelah Aktivasi ===');
const test2 = 'andre | UMLJ7QW6TC | 1 Tahun | 354159398087b978 | Xiaomi 2306EPN60G | Android 15 (API 35) | 16 November 2025';
const result2 = parseGistContent(test2);
console.log('Input:', test2);
console.log('Output:', JSON.stringify(result2, null, 2));
console.log('');

// Test case 3: Multiple lines
console.log('=== Test 3: Multiple Lines ===');
const test3 = `andre | UMLJ7QW6TC | 1 Tahun |  |  |  | 
budi | ABC1234567 | 2 Tahun | 123456789 | Samsung Galaxy S21 | Android 13 (API 33) | 15 November 2025
charlie | XYZ9876543 | Permanen |  |  |  | `;
const result3 = parseGistContent(test3);
console.log('Input:');
console.log(test3);
console.log('Output:', JSON.stringify(result3, null, 2));
console.log('');

// Test case 4: Edge case - minimal data
console.log('=== Test 4: Minimal Data ===');
const test4 = 'john | KEY123 | 1 Tahun';
const result4 = parseGistContent(test4);
console.log('Input:', test4);
console.log('Output:', JSON.stringify(result4, null, 2));
