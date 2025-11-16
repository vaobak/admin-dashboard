import { useState, useEffect } from 'react';
import { generateLicenseKey } from '../utils/github';
import { Save, X, RefreshCw, FileEdit, FilePlus } from 'lucide-react';

export default function LicenseFormModal({ isOpen, onClose, onSave, editData }) {
  const [formData, setFormData] = useState({
    userName: '',
    licenseKey: '',
    masaAktif: '1 Tahun',
    maxDevice: '1',
    customYears: '',
    deviceId: '',
    device: '',
    androidVersion: '',
    aktivasiPertama: ''
  });

  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setShowCustom(editData.masaAktif && !['1 Tahun', '2 Tahun', '3 Tahun', 'Permanen'].includes(editData.masaAktif));
    } else {
      const newKey = generateLicenseKey();
      setFormData({
        userName: '',
        licenseKey: newKey,
        masaAktif: '1 Tahun',
        maxDevice: '1',
        customYears: '',
        deviceId: '',
        device: '',
        androidVersion: '',
        aktivasiPertama: ''
      });
      setShowCustom(false);
    }
  }, [editData, isOpen]);

  const handleMasaAktifChange = (value) => {
    if (value === 'Custom') {
      setShowCustom(true);
      setFormData({...formData, masaAktif: ''});
    } else {
      setShowCustom(false);
      setFormData({...formData, masaAktif: value, customYears: ''});
    }
  };

  const handleGenerateKey = () => {
    const newKey = generateLicenseKey();
    setFormData({...formData, licenseKey: newKey});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalMasaAktif = formData.masaAktif;
    if (showCustom && formData.customYears) {
      finalMasaAktif = `${formData.customYears} Tahun`;
    }
    
    onSave({
      ...formData,
      masaAktif: finalMasaAktif
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            {editData ? <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <FilePlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {editData ? 'Edit Lisensi' : 'Tambah Lisensi'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
              placeholder="Masukkan nama pengguna"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              License Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.licenseKey}
                onChange={(e) => setFormData({...formData, licenseKey: e.target.value})}
                className="flex-1 px-4 py-2.5 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 font-mono font-bold text-base bg-blue-50 dark:bg-blue-900/20"
                required
                readOnly={!editData}
              />
              {!editData && (
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow"
                  title="Generate Key Baru"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Masa Aktif
            </label>
            <select
              value={showCustom ? 'Custom' : formData.masaAktif}
              onChange={(e) => handleMasaAktifChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
              required={!showCustom}
            >
              <option value="1 Tahun">1 Tahun</option>
              <option value="2 Tahun">2 Tahun</option>
              <option value="3 Tahun">3 Tahun</option>
              <option value="Permanen">Permanen</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jumlah Device Maksimal
            </label>
            <select
              value={formData.maxDevice}
              onChange={(e) => setFormData({...formData, maxDevice: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
              required
            >
              <option value="1">1 Perangkat</option>
              <option value="2">2 Perangkat</option>
              <option value="3">3 Perangkat</option>
              <option value="4">4 Perangkat</option>
              <option value="5">5 Perangkat</option>
            </select>
          </div>

          {showCustom && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Tahun
              </label>
              <input
                type="number"
                min="1"
                value={formData.customYears}
                onChange={(e) => setFormData({...formData, customYears: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
                placeholder="Masukkan jumlah tahun"
                required
              />
            </div>
          )}

          {editData && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device ID
                </label>
                <input
                  type="text"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all font-mono text-sm"
                  placeholder="Diisi otomatis oleh aplikasi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Perangkat (Model)
                </label>
                <input
                  type="text"
                  value={formData.device}
                  onChange={(e) => setFormData({...formData, device: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
                  placeholder="Diisi otomatis oleh aplikasi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Versi Android
                </label>
                <input
                  type="text"
                  value={formData.androidVersion}
                  onChange={(e) => setFormData({...formData, androidVersion: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
                  placeholder="Diisi otomatis oleh aplikasi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aktivasi Pertama
                </label>
                <input
                  type="text"
                  value={formData.aktivasiPertama}
                  onChange={(e) => setFormData({...formData, aktivasiPertama: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
                  placeholder="Diisi otomatis oleh aplikasi"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-3 sm:px-4 rounded-xl transition-all shadow-sm hover:shadow font-medium text-sm"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Simpan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-3 sm:px-4 rounded-xl transition-all font-medium text-sm"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Batal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
