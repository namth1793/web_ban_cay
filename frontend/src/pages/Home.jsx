import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import BlogCard from '../components/BlogCard';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';

const categories = [
  { label: 'Xương Rồng Mini', slug: 'xuong-rong-mini', emoji: '🌵', color: 'from-green-500 to-emerald-600', desc: 'Sen đá, cầu vàng, haworthia...' },
  { label: 'Xương Rồng Decor', slug: 'xuong-rong-decor', emoji: '🌿', color: 'from-teal-600 to-green-700', desc: 'Cereus, Euphorbia, Agave...' },
  { label: 'Các Loại Cây Khác', slug: 'cay-khac', emoji: '🌸', color: 'from-lime-500 to-green-600', desc: 'Cây trong nhà, hoa, bonsai...' },
];

const productSections = [
  { title: 'XƯƠNG RỒNG MINI', category: 'xuong-rong-mini' },
  { title: 'XƯƠNG RỒNG DECOR', category: 'xuong-rong-decor' },
  { title: 'CÁC LOẠI CÂY KHÁC', category: 'cay-khac' },
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
            <a href="tel:0979840050" className="underline underline-offset-2">096.1144.560</a>
          </div>
          <div className="flex gap-4 text-primary-100 text-xs">
            <span>✅ Giao hàng toàn quốc</span>
            <span>✅ Xương rồng chất lượng</span>
            <span>✅ Hỗ trợ chăm sóc miễn phí</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">DANH MỤC SẢN PHẨM</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map(c => (
              <Link key={c.slug} to={`/san-pham?category=${c.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`bg-gradient-to-br ${c.color} p-8 h-full flex flex-col items-center justify-center text-white text-center min-h-[160px]`}>
                  <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
                  <p className="font-bold text-lg leading-tight mb-1">{c.label}</p>
                  <p className="text-white/80 text-sm">{c.desc}</p>
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
              ['🌵', 'Cây Chất Lượng', 'Tuyển chọn từ vườn ươm đạt chuẩn'],
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
