import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../../adminApi';

const nav = [
  { to: '/admin', label: 'Tổng quan', icon: '📊', end: true },
  { to: '/admin/products', label: 'Sản phẩm', icon: '🌿' },
  { to: '/admin/articles', label: 'Bài viết', icon: '📝' },
  { to: '/admin/banners', label: 'Banner Hero', icon: '🖼️' },
  { to: '/admin/orders', label: 'Đơn hàng', icon: '🛒' },
  { to: '/admin/contacts', label: 'Liên hệ', icon: '📬' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-green-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌵</span>
            <div>
              <p className="font-bold text-sm leading-tight">Xương Rồng</p>
              <p className="text-green-300 text-xs">Nông Lâm Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-green-600 text-white' : 'text-green-100 hover:bg-green-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-green-100 hover:bg-green-800 transition"
          >
            <span>🚪</span> Đăng xuất
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-green-100 hover:bg-green-800 transition"
          >
            <span>🌐</span> Xem website
          </a>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
