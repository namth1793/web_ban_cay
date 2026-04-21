import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import Toast from '../components/Toast';
import { api } from '../api';

const categories = [
  { label: 'Cây Cảnh Trong Nhà', slug: 'cay-canh-trong-nha', emoji: '🌿', color: 'from-emerald-500 to-teal-600', desc: 'Monstera, Pothos, Lưỡi Hổ...' },
  { label: 'Cây Hoa & Cây Ra Hoa', slug: 'cay-hoa-ra-hoa', emoji: '🌸', color: 'from-pink-400 to-rose-600', desc: 'Lan, Hồng, Cẩm Tú Cầu...' },
  { label: 'Xương Rồng & Sen Đá', slug: 'xuong-rong-sen-da', emoji: '🌵', color: 'from-green-500 to-lime-600', desc: 'Sen đá, Xương rồng, Agave...' },
  { label: 'Cây Thảo Mộc & Rau Sạch', slug: 'cay-thao-moc-rau-sach', emoji: '🌱', color: 'from-lime-500 to-green-600', desc: 'Rau thơm, Lô hội, Sả...' },
  { label: 'Cây Bonsai & Tiểu Cảnh', slug: 'cay-bonsai-tieu-canh', emoji: '🎋', color: 'from-teal-500 to-cyan-600', desc: 'Bonsai nghệ thuật, Terrarium...' },
  { label: 'Quà Tặng Cây Mini', slug: 'qua-tang-cay-mini', emoji: '🎁', color: 'from-amber-500 to-orange-500', desc: 'Combo quà tặng đẹp...' },
];

const productSections = [
  { title: 'CÂY CẢNH TRONG NHÀ', category: 'cay-canh-trong-nha' },
  { title: 'CÂY HOA & CÂY RA HOA', category: 'cay-hoa-ra-hoa' },
  { title: 'XƯƠNG RỒNG & SEN ĐÁ', category: 'xuong-rong-sen-da' },
  { title: 'BONSAI & TIỂU CẢNH', category: 'cay-bonsai-tieu-canh' },
];

function ProductSection({ title, category, onAddToCart }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.getProducts({ category, limit: 8 }).then(setProducts);
  }, [category]);
  if (!products.length) return null;
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="section-title">{title}</h2>
          <Link to={`/san-pham?category=${category}`} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [toast, setToast] = useState(false);
  const handleAdd = () => setToast(true);

  useEffect(() => {
    api.getArticles({ limit: 3 }).then(setArticles);
  }, []);

  return (
    <>
      <HeroSlider />

      {/* Hotline bar */}
      <div className="bg-primary-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-base">
            <span className="animate-pulse">📞</span>
            HOTLINE:&nbsp;
            <a href="tel:0979840050" className="underline underline-offset-2">0979.840.050</a>
            <span className="text-primary-300 font-normal">&nbsp;|&nbsp;</span>
            <a href="tel:0337123030" className="underline underline-offset-2">0337.123.030</a>
          </div>
          <div className="flex gap-4 text-primary-100 text-xs">
            <span>✅ Giao hàng toàn quốc</span>
            <span>✅ Cây chất lượng cao</span>
            <span>✅ Hỗ trợ chăm sóc miễn phí</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">DANH MỤC SẢN PHẨM</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(c => (
              <Link key={c.slug} to={`/san-pham?category=${c.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`bg-gradient-to-br ${c.color} p-5 h-full flex flex-col items-center justify-center text-white text-center min-h-[130px]`}>
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
                  <p className="font-bold text-xs leading-tight mb-1">{c.label}</p>
                  <p className="text-white/70 text-[10px] hidden sm:block">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              ['🌱', 'Cây Chất Lượng', 'Tuyển chọn từ vườn ươm đạt chuẩn'],
              ['🚚', 'Giao Hàng Nhanh', 'Toàn quốc trong 1-3 ngày'],
              ['🎁', 'Đóng Gói Đẹp', 'An toàn, cẩn thận từng cây'],
              ['💬', 'Tư Vấn 24/7', 'Hỗ trợ chăm sóc cây miễn phí'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex flex-col items-center py-3">
                <span className="text-3xl mb-2">{icon}</span>
                <p className="font-bold text-gray-800 text-sm">{title}</p>
                <p className="text-gray-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product sections */}
      {productSections.map(s => (
        <ProductSection key={s.category} title={s.title} category={s.category} onAddToCart={handleAdd} />
      ))}

      {/* Rau sạch banner */}
      <div className="bg-gradient-to-r from-lime-700 to-green-600 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 text-white">
          <div className="text-6xl">🌱</div>
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold">Tự Trồng Rau Sạch Tại Nhà</h3>
            <p className="text-lime-100 mt-1">Rau thơm, thảo mộc hữu cơ. Trồng ban công, cửa sổ - thu hoạch mỗi ngày cho bữa ăn gia đình.</p>
          </div>
          <Link to="/san-pham?category=cay-thao-moc-rau-sach" className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors flex-shrink-0 whitespace-nowrap">
            Xem Rau Sạch
          </Link>
        </div>
      </div>

      {/* Gift banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 text-white">
          <div className="text-6xl">🎁</div>
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold">Quà Tặng Cây Xanh Ý Nghĩa</h3>
            <p className="text-amber-100 mt-1">Combo cây mini đóng gói đẹp, kèm thiệp và hướng dẫn chăm sóc. Thích hợp tặng sinh nhật, khai trương, tốt nghiệp.</p>
          </div>
          <Link to="/san-pham?category=qua-tang-cay-mini" className="bg-white text-amber-700 font-bold px-8 py-3 rounded-full hover:bg-amber-50 transition-colors flex-shrink-0 whitespace-nowrap">
            Xem Quà Tặng
          </Link>
        </div>
      </div>

      {/* Blog */}
      {articles.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title">BÀI VIẾT MỚI NHẤT</h2>
              <Link to="/cham-soc" className="text-sm font-semibold text-primary-600 hover:text-primary-800">Xem tất cả →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map(a => <BlogCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {toast && <Toast message="Đã thêm vào giỏ hàng!" onClose={() => setToast(false)} />}
    </>
  );
}
