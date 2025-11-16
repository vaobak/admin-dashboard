import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getCurrentCredentials, setStoredCredentials } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Settings() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedApps = localStorage.getItem('apps');
    if (storedApps) {
      setApps(JSON.parse(storedApps));
    }

    const creds = getCurrentCredentials();
    setNewUsername(creds.username);
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const currentCreds = getCurrentCredentials();
    
    if (oldPassword !== currentCreds.password) {
      setError('Password lama salah');
      return;
    }

    if (!newUsername || !newPassword) {
      setError('Username dan password baru harus diisi');
      return;
    }

    setStoredCredentials(newUsername, newPassword);
    setMessage('Kredensial berhasil diperbarui');
    setOldPassword('');
    setNewPassword('');
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
  };

  const handleDeleteApp = (appId) => {
    const updatedApps = apps.filter(app => app.id !== appId);
    setApps(updatedApps);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        apps={apps}
        onAddApp={handleAddApp}
        onEditApp={handleEditApp}
        onDeleteApp={handleDeleteApp}
      />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Pengaturan Akun</h1>
            <DarkModeToggle />
          </div>

          <div className="max-w-md bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username Baru</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password Lama</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              {message && (
                <div className="text-green-600 dark:text-green-400 text-sm">{message}</div>
              )}

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
