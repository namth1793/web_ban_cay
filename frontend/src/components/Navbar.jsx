import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { useCart } from '../context/CartContext';

const navItems = [
  { label: 'Trang Chủ', to: '/' },
  {
    label: 'Sản Phẩm',
    to: '/san-pham',
    sub: [
      { label: '🌵 Xương Rồng Mini', to: '/san-pham?category=xuong-rong-mini' },
      { label: '🌿 Xương Rồng Decor', to: '/san-pham?category=xuong-rong-decor' },
      { label: '🌸 Các Loại Cây Khác', to: '/san-pham?category=cay-khac' },
    ]
  },
  { label: 'Chăm Sóc', to: '/cham-soc' },
  { label: 'Thông Tin Hữu Ích', to: '/thong-tin' },
  { label: 'Liên Hệ', to: '/lien-he' },
];

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/san-pham?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to.split('?')[0]);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-primary-800 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:0961144560" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <span>📞</span> 096.1144.560
            </a>
          </div>
          <div className="flex items-center gap-3 text-primary-100">
            <span className="hidden md:inline">✅ Giao hàng toàn quốc</span>
            <span className="hidden md:inline text-primary-600">|</span>
            <a href="https://www.tiktok.com/@vuon.trenmay" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
            <span className="text-primary-600">|</span>
            <a href="https://zalo.me/0961144560" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Zalo</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="Xương Rồng Trên Mây" className="h-20 w-auto" />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm cây cảnh, hoa lan, bonsai, rau sạch..."
                className="w-full border border-gray-300 rounded-full py-2 pl-5 pr-11 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800 text-lg">
                🔍
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-3">
            <a href="tel:0961144560" className="hidden lg:flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold hover:bg-primary-100 transition-colors">
              <span>📞</span> 096.1144.560
            </a>
            <Link to="/gio-hang" className="relative flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-4 py-2 text-sm font-semibold transition-colors">
              <span>🛒</span>
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{count}</span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-600 text-xl">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="bg-primary-700 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex">
            {navItems.map(item => (
              <li key={item.label} className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link to={item.to}
                  className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${isActive(item.to) ? 'bg-primary-900 text-white' : 'text-white/90 hover:bg-primary-600 hover:text-white'}`}>
                  {item.label}
                  {item.sub && <span className="text-xs opacity-70">▾</span>}
                </Link>
                {item.sub && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-b-xl min-w-[240px] z-50 border-t-2 border-primary-500 py-1">
                    {item.sub.map(sub => (
                      <Link key={sub.to} to={sub.to}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="p-3 border-b border-gray-100">
            <div className="relative">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm cây cảnh..."
                className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary-500" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600">🔍</button>
            </div>
          </form>
          {navItems.map(item => (
            <div key={item.label}>
              <Link to={item.to} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 border-b border-gray-100">
                {item.label}
              </Link>
              {item.sub?.map(sub => (
                <Link key={sub.to} to={sub.to} onClick={() => setMobileOpen(false)}
                  className="block pl-8 pr-4 py-2.5 text-sm text-gray-500 hover:bg-primary-50 hover:text-primary-700 border-b border-gray-50">
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
