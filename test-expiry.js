// Test expiry calculation

const calculateExpiryDate = (aktivasiPertama, masaAktif) => {
  if (!aktivasiPertama || aktivasiPertama === '') {
    return 'Belum Aktivasi';
  }

  if (masaAktif === 'Permanen') {
    return 'Permanen';
  }

  try {
    const months = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
      'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
      'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11,
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const parts = aktivasiPertama.split(' ');
    if (parts.length !== 3) return 'Format Tidak Valid';

    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    if (isNaN(day) || month === undefined || isNaN(year)) {
      return 'Format Tidak Valid';
    }

    const startDate = new Date(year, month, day);
    const yearMatch = masaAktif.match(/(\d+)\s*Tahun/i);
    if (!yearMatch) return 'Format Tidak Valid';

    const years = parseInt(yearMatch[1]);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${expiryDate.getDate()} ${monthNames[expiryDate.getMonth()]} ${expiryDate.getFullYear()}`;
  } catch (error) {
    return 'Error';
  }
};

const isLicenseExpired = (aktivasiPertama, masaAktif) => {
  if (!aktivasiPertama || aktivasiPertama === '' || masaAktif === 'Permanen') {
    return false;
  }

  try {
    const months = {
      'November': 10, 'Desember': 11
    };

    const parts = aktivasiPertama.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    const startDate = new Date(year, month, day);
    const yearMatch = masaAktif.match(/(\d+)\s*Tahun/i);
    const years = parseInt(yearMatch[1]);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    const now = new Date();
    return now > expiryDate;
  } catch (error) {
    return false;
  }
};

// Test cases
console.log('=== Test Expiry Calculation ===\n');

// Test 1: Belum aktivasi
console.log('Test 1: Belum Aktivasi');
console.log('Input: aktivasi="", masaAktif="1 Tahun"');
console.log('Output:', calculateExpiryDate('', '1 Tahun'));
console.log('Expected: Belum Aktivasi\n');

// Test 2: Permanen
console.log('Test 2: Permanen');
console.log('Input: aktivasi="16 November 2025", masaAktif="Permanen"');
console.log('Output:', calculateExpiryDate('16 November 2025', 'Permanen'));
console.log('Expected: Permanen\n');

// Test 3: 1 Tahun
console.log('Test 3: 1 Tahun');
console.log('Input: aktivasi="16 November 2025", masaAktif="1 Tahun"');
console.log('Output:', calculateExpiryDate('16 November 2025', '1 Tahun'));
console.log('Expected: 16 November 2026\n');

// Test 4: 2 Tahun
console.log('Test 4: 2 Tahun');
console.log('Input: aktivasi="16 November 2025", masaAktif="2 Tahun"');
console.log('Output:', calculateExpiryDate('16 November 2025', '2 Tahun'));
console.log('Expected: 16 November 2027\n');

// Test 5: Check if expired (old date)
console.log('Test 5: Check Expired (Old Date)');
console.log('Input: aktivasi="16 November 2023", masaAktif="1 Tahun"');
console.log('Expiry Date:', calculateExpiryDate('16 November 2023', '1 Tahun'));
console.log('Is Expired?:', isLicenseExpired('16 November 2023', '1 Tahun'));
console.log('Expected: true (sudah lewat November 2024)\n');

// Test 6: Check if not expired (future date)
console.log('Test 6: Check Not Expired (Future Date)');
console.log('Input: aktivasi="16 November 2025", masaAktif="1 Tahun"');
console.log('Expiry Date:', calculateExpiryDate('16 November 2025', '1 Tahun'));
console.log('Is Expired?:', isLicenseExpired('16 November 2025', '1 Tahun'));
console.log('Expected: false (belum lewat November 2026)\n');
