import { calculateExpiryDate } from '../utils/github';
import { Edit2, Trash2 } from 'lucide-react';

export default function LicenseTable({ licenses, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Nama
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Masa Aktif
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Device ID
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Perangkat
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Aktif Sampai
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {licenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data lisensi
                </td>
              </tr>
            ) : (
              licenses.map((license) => {
                const expiryDate = calculateExpiryDate(license.aktivasiPertama, license.masaAktif);
                const isExpiringSoon = expiryDate !== 'Belum Aktivasi' && expiryDate !== 'Permanen' && expiryDate !== 'Format Tidak Valid';
                
                return (
                  <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{license.userName || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{license.masaAktif || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-500">{license.deviceId || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">{license.device || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">
                      <span className={
                        expiryDate === 'Permanen' ? 'text-green-600 dark:text-green-400 font-semibold' :
                        expiryDate === 'Belum Aktivasi' ? 'text-gray-500 dark:text-gray-400' :
                        isExpiringSoon ? 'text-blue-600 dark:text-blue-400' :
                        'text-gray-700 dark:text-gray-300'
                      }>
                        {expiryDate}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => onEdit(license)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(license.id)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
