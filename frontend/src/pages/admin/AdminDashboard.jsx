import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';

const fmt = (n) => n?.toLocaleString('vi-VN') ?? '—';

const cards = [
  { key: 'products', label: 'Sản phẩm', icon: '🌿', color: 'bg-green-100 text-green-800' },
  { key: 'articles', label: 'Bài viết', icon: '📝', color: 'bg-blue-100 text-blue-800' },
  { key: 'orders', label: 'Đơn hàng', icon: '🛒', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'contacts', label: 'Liên hệ', icon: '📬', color: 'bg-purple-100 text-purple-800' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.stats().then(setStats).catch(e => setError(e.message));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.key} className="bg-white rounded-xl shadow p-5">
            <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full mb-3 ${c.color}`}>
              {c.icon} {c.label}
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats ? fmt(stats[c.key]) : '...'}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500 text-sm mb-1">Tổng doanh thu</p>
        <p className="text-3xl font-bold text-green-700">
          {stats ? fmt(stats.revenue) + ' ₫' : '...'}
        </p>
        <p className="text-xs text-gray-400 mt-1">(Không tính đơn đã hủy)</p>
      </div>
    </div>
  );
}
