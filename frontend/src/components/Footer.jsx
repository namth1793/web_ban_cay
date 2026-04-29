import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <img src={logo} alt="Xương Rồng Trên Mây" className="h-16 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Chuyên cung cấp cây cảnh trong nhà, hoa lan, bonsai, xương rồng, sen đá và rau thảo mộc sạch.
              Hơn 10 năm kinh nghiệm, uy tín hàng đầu TP.HCM.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.tiktok.com/@vuon.trenmay" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center transition-colors text-sm font-bold">T</a>
              <a href="https://zalo.me/0961144560" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold text-white" style={{backgroundColor:'#0068FF'}}>Z</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Danh Mục</h4>
            <ul className="space-y-2">
              {[
                ['🌵 Xương Rồng Mini', '/san-pham?category=xuong-rong-mini'],
                ['🌿 Xương Rồng Decor', '/san-pham?category=xuong-rong-decor'],
                ['🌸 Các Loại Cây Khác', '/san-pham?category=cay-khac'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Hỗ Trợ</h4>
            <ul className="space-y-2">
              {[
                ['Hướng Dẫn Chăm Sóc Cây', '/cham-soc'],
                ['Thông Tin Hữu Ích', '/thong-tin'],
                ['Liên Hệ & Đặt Hàng', '/lien-he'],
                ['Giỏ Hàng', '/gio-hang'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1">
                    <span className="text-primary-600">›</span>{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-primary-400 flex-shrink-0 mt-0.5">📍</span>
                <span>Phường Long Phước, TP. Hồ Chí Minh (Quận 9 cũ)</span>
              </li>
              <li>
                <a href="tel:0961144560" className="flex gap-2 hover:text-primary-400 transition-colors">
                  <span className="text-primary-400">📞</span>
                  <span>096.1144.560</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-xs text-gray-500">
          <p>© 2025 Xương Rồng Trên Mây. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-gray-300 transition-colors">🔒 Quản trị</Link>
        </div>
      </div>
    </footer>
  );
}
