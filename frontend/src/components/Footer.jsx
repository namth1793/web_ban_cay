import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <div>
                <div className="font-extrabold text-white text-lg leading-tight">Cây Cảnh Nông Lâm</div>
                <div className="text-xs text-gray-400">Cây xanh - Hoa - Bonsai - Rau sạch</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Chuyên cung cấp cây cảnh trong nhà, hoa lan, bonsai, xương rồng, sen đá và rau thảo mộc sạch.
              Hơn 10 năm kinh nghiệm, uy tín hàng đầu TP.HCM.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors text-sm font-bold">f</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors text-sm">♪</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors text-sm">▶</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Danh Mục</h4>
            <ul className="space-y-2">
              {[
                ['🌿 Cây Cảnh Trong Nhà', '/san-pham?category=cay-canh-trong-nha'],
                ['🌸 Cây Hoa & Cây Ra Hoa', '/san-pham?category=cay-hoa-ra-hoa'],
                ['🌵 Xương Rồng & Sen Đá', '/san-pham?category=xuong-rong-sen-da'],
                ['🌱 Thảo Mộc & Rau Sạch', '/san-pham?category=cay-thao-moc-rau-sach'],
                ['🎋 Bonsai & Tiểu Cảnh', '/san-pham?category=cay-bonsai-tieu-canh'],
                ['🎁 Quà Tặng Cây Mini', '/san-pham?category=qua-tang-cay-mini'],
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
                <span>1062 Đỗ Mười, Phường Linh Xuân, TP.HCM</span>
              </li>
              <li>
                <a href="tel:0979840050" className="flex gap-2 hover:text-primary-400 transition-colors">
                  <span className="text-primary-400">📞</span>
                  <span>Cửa hàng: 0979.840.050</span>
                </a>
              </li>
              <li>
                <a href="tel:0337123030" className="flex gap-2 hover:text-primary-400 transition-colors">
                  <span className="text-primary-400">📞</span>
                  <span>Vườn ươm: 0337.123.030</span>
                </a>
              </li>
              <li>
                <a href="mailto:sendanonglam.hcm@gmail.com" className="flex gap-2 hover:text-primary-400 transition-colors">
                  <span className="text-primary-400">✉️</span>
                  <span>sendanonglam.hcm@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2025 Cây Cảnh Nông Lâm. MST: 036096020467</p>
          <p>Người đại diện: Vũ Văn Đấu</p>
        </div>
      </div>
    </footer>
  );
}
