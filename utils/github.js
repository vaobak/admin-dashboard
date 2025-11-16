export const fetchGistContent = async (rawUrl) => {
  try {
    console.log('Fetching Gist via API route:', rawUrl);
    
    // Use API route to avoid CORS issues
    const response = await fetch('/api/fetchGist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: rawUrl })
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content;
    
    console.log('Fetched text length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));
    
    return text;
  } catch (error) {
    console.error('Error fetching gist:', error);
    throw new Error(`Gagal mengambil data dari Gist: ${error.message}`);
  }
};

export const parseGistContent = (content) => {
  if (!content || !content.trim()) {
    console.log('Empty content received');
    return [];
  }
  
  console.log('Parsing content, length:', content.length);
  
  const lines = content.split('\n').filter(line => line.trim());
  console.log('Total lines to parse:', lines.length);
  
  const results = lines.map((line, index) => {
    try {
      // Split by pipe and trim each part
      const parts = line.split('|').map(p => p.trim());
      
      // Format: Nama Pengguna | LICENSE_KEY | Masa Aktif | Max Device | DEVICE_ID | MANUFACTURER MODEL | Android VERSION | Aktivasi Pertama
      // Minimal harus ada 3 field (userName, licenseKey, masaAktif)
      if (parts.length >= 3) {
        const parsed = {
          id: index,
          userName: parts[0] || '',
          licenseKey: parts[1] || '',
          masaAktif: parts[2] || '',
          maxDevice: parts[3] || '1',
          deviceId: parts[4] || '',
          device: parts[5] || '',
          androidVersion: parts[6] || '',
          aktivasiPertama: parts[7] || ''
        };
        return parsed;
      }
      
      console.warn(`Line ${index + 1} skipped: insufficient fields (${parts.length})`);
      return null;
    } catch (error) {
      console.error(`Error parsing line ${index + 1}:`, error);
      return null;
    }
  }).filter(Boolean);
  
  console.log('✓ Successfully parsed', results.length, 'licenses');
  return results;
};

export const formatGistContent = (licenses) => {
  return licenses.map(license => 
    `${license.userName || ''} | ${license.licenseKey || ''} | ${license.masaAktif || ''} | ${license.maxDevice || '1'} | ${license.deviceId || ''} | ${license.device || ''} | ${license.androidVersion || ''} | ${license.aktivasiPertama || ''}`
  ).join('\n');
};

export const calculateExpiryDate = (aktivasiPertama, masaAktif) => {
  if (!aktivasiPertama || aktivasiPertama === '') {
    return 'Belum Aktivasi';
  }

  if (masaAktif === 'Permanen') {
    return 'Permanen';
  }

  try {
    // Parse aktivasi date (format: "16 November 2025")
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

    // Extract years from masaAktif (e.g., "1 Tahun" -> 1)
    const yearMatch = masaAktif.match(/(\d+)\s*Tahun/i);
    if (!yearMatch) return 'Format Tidak Valid';

    const years = parseInt(yearMatch[1]);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    // Format: "16 November 2026"
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${expiryDate.getDate()} ${monthNames[expiryDate.getMonth()]} ${expiryDate.getFullYear()}`;
  } catch (error) {
    console.error('Error calculating expiry:', error);
    return 'Error';
  }
};

export const isLicenseExpired = (aktivasiPertama, masaAktif) => {
  if (!aktivasiPertama || aktivasiPertama === '' || masaAktif === 'Permanen') {
    return false;
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
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    if (isNaN(day) || month === undefined || isNaN(year)) {
      return false;
    }

    const startDate = new Date(year, month, day);
    const yearMatch = masaAktif.match(/(\d+)\s*Tahun/i);
    if (!yearMatch) return false;

    const years = parseInt(yearMatch[1]);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    const now = new Date();
    return now > expiryDate;
  } catch (error) {
    console.error('Error checking expiry:', error);
    return false;
  }
};

export const removeExpiredLicenses = (licenses) => {
  const active = licenses.filter(license => !isLicenseExpired(license.aktivasiPertama, license.masaAktif));
  const removed = licenses.length - active.length;
  
  if (removed > 0) {
    console.log(`🗑️ Removed ${removed} expired license(s)`);
  }
  
  return active;
};

export const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const extractGistId = (url) => {
  const match = url.match(/gist\.githubusercontent\.com\/[^\/]+\/([a-f0-9]+)/);
  return match ? match[1] : null;
};

export const extractFilename = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'gpslicense';
};
