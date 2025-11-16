import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../utils/auth';
import { fetchGistContent, parseGistContent, formatGistContent, extractGistId, extractFilename, removeExpiredLicenses } from '../../utils/github';
import Sidebar from '../../components/Sidebar';
import DarkModeToggle from '../../components/DarkModeToggle';
import StatsCard from '../../components/StatsCard';
import LicenseTable from '../../components/LicenseTable';
import LicenseFormModal from '../../components/LicenseFormModal';
import { BarChart3, Smartphone, TrendingUp, Plus, RefreshCw, Search } from 'lucide-react';

export default function AppDetail() {
  const router = useRouter();
  const { appId } = router.query;
  
  const [apps, setApps] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    uniqueDevices: 0,
    popularVersion: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Initialize default app if none exists
    const storedApps = localStorage.getItem('apps');
    let appsList = [];
    
    if (!storedApps) {
      appsList = [{
        id: 'lokasi-pkm',
        name: 'Lokasi PKM',
        gistRawUrl: 'https://gist.githubusercontent.com/wanerai/92721d346f93ea7ed41fd403f88cd9e6/raw/gpslicense'
      }];
      localStorage.setItem('apps', JSON.stringify(appsList));
    } else {
      appsList = JSON.parse(storedApps);
    }
    
    setApps(appsList);

    if (appId) {
      const app = appsList.find(a => a.id === appId);
      if (app) {
        setCurrentApp(app);
        loadLicenses(app.gistRawUrl);
      }
    }
  }, [router, appId]);

  const loadLicenses = async (url, autoCleanExpired = true) => {
    setLoading(true);
    try {
      console.log('=== Loading Licenses ===');
      console.log('URL:', url);
      
      const content = await fetchGistContent(url);
      console.log('Raw Gist Content received, length:', content?.length);
      
      if (!content) {
        throw new Error('Konten Gist kosong');
      }
      
      let parsed = parseGistContent(content);
      console.log('Parsed Licenses count:', parsed?.length);
      
      // Auto-remove expired licenses
      if (autoCleanExpired) {
        const beforeCount = parsed.length;
        parsed = removeExpiredLicenses(parsed);
        const afterCount = parsed.length;
        
        if (beforeCount > afterCount) {
          console.log(`🗑️ Auto-removed ${beforeCount - afterCount} expired license(s)`);
          // Update Gist to remove expired licenses
          await updateGist(parsed);
        }
      }
      
      if (parsed && parsed.length > 0) {
        console.log('First license:', parsed[0]);
      }
      
      setLicenses(parsed);
      setFilteredLicenses(parsed);
      calculateStats(parsed);
      
      console.log('=== Loading Complete ===');
    } catch (error) {
      console.error('=== Error Loading Licenses ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert('Gagal memuat data lisensi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLicenses(licenses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = licenses.filter(license => {
      return (
        (license.userName && license.userName.toLowerCase().includes(query)) ||
        (license.licenseKey && license.licenseKey.toLowerCase().includes(query)) ||
        (license.masaAktif && license.masaAktif.toLowerCase().includes(query)) ||
        (license.deviceId && license.deviceId.toLowerCase().includes(query)) ||
        (license.device && license.device.toLowerCase().includes(query)) ||
        (license.androidVersion && license.androidVersion.toLowerCase().includes(query)) ||
        (license.aktivasiPertama && license.aktivasiPertama.toLowerCase().includes(query))
      );
    });
    setFilteredLicenses(filtered);
  };

  const calculateStats = (licensesData) => {
    const total = licensesData.length;
    const uniqueDevices = new Set(licensesData.map(l => l.deviceId)).size;
    
    const versionCounts = {};
    licensesData.forEach(l => {
      versionCounts[l.androidVersion] = (versionCounts[l.androidVersion] || 0) + 1;
    });
    
    const popularVersion = Object.entries(versionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    setStats({ total, uniqueDevices, popularVersion });
  };

  const updateGist = async (newLicenses) => {
    if (!currentApp) return;

    const gistId = extractGistId(currentApp.gistRawUrl);
    const filename = extractFilename(currentApp.gistRawUrl);
    const content = formatGistContent(newLicenses);

    try {
      const response = await fetch('/api/updateGist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gistId, filename, content })
      });

      if (!response.ok) {
        throw new Error('Failed to update gist');
      }

      return true;
    } catch (error) {
      console.error('Error updating gist:', error);
      alert('Gagal menyimpan ke GitHub Gist');
      return false;
    }
  };

  const handleAddLicense = async (licenseData) => {
    const newLicense = {
      ...licenseData,
      id: licenses.length,
      maxDevice: licenseData.maxDevice || '1',
      deviceId: licenseData.deviceId || '',
      device: licenseData.device || '',
      androidVersion: licenseData.androidVersion || '',
      aktivasiPertama: licenseData.aktivasiPertama || ''
    };
    const newLicenses = [...licenses, newLicense];
    
    if (await updateGist(newLicenses)) {
      setLicenses(newLicenses);
      setFilteredLicenses(newLicenses);
      calculateStats(newLicenses);
      setShowModal(false);
      setSearchQuery('');
    }
  };

  const handleEditLicense = async (licenseData) => {
    const newLicenses = licenses.map(l => 
      l.id === editingLicense.id ? { ...licenseData, id: l.id } : l
    );
    
    if (await updateGist(newLicenses)) {
      setLicenses(newLicenses);
      setFilteredLicenses(newLicenses);
      calculateStats(newLicenses);
      setShowModal(false);
      setEditingLicense(null);
      setSearchQuery('');
    }
  };

  const handleDeleteLicense = async (licenseId) => {
    if (!confirm('Yakin hapus lisensi ini?')) return;
    
    const newLicenses = licenses.filter(l => l.id !== licenseId);
    
    if (await updateGist(newLicenses)) {
      setLicenses(newLicenses);
      setFilteredLicenses(newLicenses);
      calculateStats(newLicenses);
      setSearchQuery('');
    }
  };

  const handleRefresh = () => {
    if (currentApp) {
      setSearchQuery('');
      loadLicenses(currentApp.gistRawUrl);
    }
  };

  const handleAddApp = (appData) => {
    const newApp = {
      id: appData.name.toLowerCase().replace(/\s+/g, '-'),
      ...appData
    };
    const updatedApps = [...apps, newApp];
    setApps(updatedApps);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
  };

  const handleEditApp = (appId, appData) => {
    const updatedApps = apps.map(app => 
      app.id === appId ? { ...app, ...appData } : app
    );
    setApps(updatedApps);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
    
    if (currentApp && currentApp.id === appId) {
      const updated = { ...currentApp, ...appData };
      setCurrentApp(updated);
      loadLicenses(updated.gistRawUrl);
    }
  };

  const handleDeleteApp = (appId) => {
    const updatedApps = apps.filter(app => app.id !== appId);
    setApps(updatedApps);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
    
    if (currentApp && currentApp.id === appId) {
      router.push('/');
    }
  };

  if (!currentApp) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        apps={apps}
        onAddApp={handleAddApp}
        onEditApp={handleEditApp}
        onDeleteApp={handleDeleteApp}
      />
      
      <div className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentApp.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola lisensi aplikasi Anda</p>
            </div>
            <DarkModeToggle />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatsCard 
              title="Total Lisensi Aktif" 
              value={stats.total} 
              icon={BarChart3} 
              variant="primary"
            />
            <StatsCard 
              title="Perangkat Unik" 
              value={stats.uniqueDevices} 
              icon={Smartphone}
            />
            <StatsCard 
              title="Versi Android Terpopuler" 
              value={stats.popularVersion} 
              icon={TrendingUp}
            />
          </div>

          {/* Search & Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 mb-4 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Cari..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setEditingLicense(null);
                    setShowModal(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-3 sm:px-4 rounded-xl transition-all shadow-sm hover:shadow font-medium text-sm"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  <span className="hidden xs:inline">Tambah</span>
                  <span className="xs:hidden">Add</span>
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-3 sm:px-4 rounded-xl transition-all border border-gray-200 dark:border-gray-700 font-medium text-sm"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-sm">Memuat data...</div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-1">
                  Menampilkan {filteredLicenses.length} dari {licenses.length} lisensi
                </div>
              )}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <LicenseTable
                    licenses={filteredLicenses}
                    onEdit={(license) => {
                      setEditingLicense(license);
                      setShowModal(true);
                    }}
                    onDelete={handleDeleteLicense}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <LicenseFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLicense(null);
        }}
        onSave={editingLicense ? handleEditLicense : handleAddLicense}
        editData={editingLicense}
      />
    </div>
  );
}
