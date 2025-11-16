import { useState, useEffect } from 'react';
import { Save, X, Smartphone } from 'lucide-react';

export default function AddAppModal({ isOpen, onClose, onSave, editData }) {
  const [name, setName] = useState('');
  const [gistRawUrl, setGistRawUrl] = useState('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setGistRawUrl(editData.gistRawUrl);
    } else {
      setName('');
      setGistRawUrl('');
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, gistRawUrl });
    setName('');
    setGistRawUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editData ? 'Edit Aplikasi' : 'Tambah Aplikasi'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all"
              placeholder="Masukkan nama aplikasi"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raw Gist URL
            </label>
            <input
              type="url"
              value={gistRawUrl}
              onChange={(e) => setGistRawUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 transition-all font-mono text-sm"
              placeholder="https://gist.githubusercontent.com/..."
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Simpan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-xl transition-all font-medium"
            >
              <X className="w-4 h-4" />
              <span>Batal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
