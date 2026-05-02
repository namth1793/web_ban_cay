import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { api, formatPrice, discount } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [data, setData] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setActiveImg(0);
    api.getProduct(slug).then(setData).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  );

  if (!data || data.error) return (
    <div className="text-center py-24 text-gray-400">
      <div className="text-5xl mb-4">🌵</div>
      <p>Không tìm thấy sản phẩm</p>
      <Link to="/san-pham" className="mt-4 btn-primary inline-block text-sm">Quay lại</Link>
    </div>
  );

  const disc = discount(data.price, data.original_price);
  const images = (data.images && data.images.length > 0) ? data.images : (data.image ? [data.image] : []);
  const PLACEHOLDER = 'https://placehold.co/600x600/dcfce7/166534?text=🌵';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link to={`/san-pham?category=${data.category_slug}`} className="hover:text-primary-600">{data.category_name}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 font-medium">{data.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square mb-3">
            <img
              src={images[activeImg] || PLACEHOLDER}
              alt={data.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? 'border-primary-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-primary-600 text-sm font-semibold mb-1">{data.category_name}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{data.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold text-primary-700">{formatPrice(data.price)}</span>
            {data.original_price && (
              <>
                <span className="text-gray-400 text-lg line-through">{formatPrice(data.original_price)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">-{disc}%</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span className="text-amber-500">★★★★★</span>
            <span>5.0</span>
            <span className="text-gray-300">|</span>
            <span>Đã bán: {data.sold}</span>
            <span className="text-gray-300">|</span>
            <span>Còn {data.stock} sản phẩm</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{data.description}</p>

          {data.care_info && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
              <p className="text-primary-800 font-semibold text-sm mb-1">🌿 Hướng dẫn chăm sóc</p>
              <p className="text-primary-700 text-sm leading-relaxed">{data.care_info}</p>
            </div>
          )}

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 text-lg text-gray-600 hover:bg-gray-100 transition-colors">−</button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 text-lg text-gray-600 hover:bg-gray-100 transition-colors">+</button>
            </div>
            <button
              onClick={() => { addItem(data, qty); setToast(true); }}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
            >
              🛒 Thêm Vào Giỏ Hàng
            </button>
          </div>

          <Link to="/gio-hang"
            onClick={() => addItem(data, qty)}
            className="block w-full text-center btn-outline py-3 mb-6">
            Mua Ngay
          </Link>

          <div className="flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">✅ Hàng chính hãng</span>
            <span className="flex items-center gap-1">🚚 Giao toàn quốc</span>
            <span className="flex items-center gap-1">🔄 Đổi trả 7 ngày</span>
          </div>
        </div>
      </div>

      {/* Related */}
      {data.related?.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.related.map(p => <ProductCard key={p.id} product={{ ...p, category_name: data.category_name }} onAddToCart={() => setToast(true)} />)}
          </div>
        </section>
      )}

      {toast && <Toast message="Đã thêm vào giỏ hàng!" onClose={() => setToast(false)} />}
    </div>
  );
}
