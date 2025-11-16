import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { logout } from '../utils/auth';
import AddAppModal from './AddAppModal';
import { Menu, X, Plus, Smartphone, Settings, LogOut, Edit2, Trash2 } from 'lucide-react';

export default function Sidebar({ apps, onAddApp, onEditApp, onDeleteApp }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowAddModal(true);
  };

  const handleDelete = (appId) => {
    if (confirm('Yakin hapus aplikasi ini?')) {
      onDeleteApp(appId);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200`}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">
                  License Manager
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={() => {
                setEditingApp(null);
                setShowAddModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow font-medium text-sm mb-6"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Tambah Aplikasi</span>
            </button>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                Aplikasi
              </p>
              {apps.map(app => (
                <div key={app.id} className="group relative">
                  <Link
                    href={`/apps/${app.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      router.asPath === `/apps/${app.id}`
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" strokeWidth={2} />
                    <span className="flex-1">{app.name}</span>
                  </Link>
                  <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                    <button
                      onClick={() => handleEdit(app)}
                      className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              <Settings className="w-4 h-4" strokeWidth={2} />
              <span>Pengaturan</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600 dark:text-red-400 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}

      <AddAppModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingApp(null);
        }}
        onSave={(appData) => {
          if (editingApp) {
            onEditApp(editingApp.id, appData);
          } else {
            onAddApp(appData);
          }
          setShowAddModal(false);
          setEditingApp(null);
        }}
        editData={editingApp}
      />
    </>
  );
}
