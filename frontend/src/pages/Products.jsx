import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { api } from '../api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts({ category, search, limit: 100 })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, search]);

  const setFilter = (slug) => {
    const p = new URLSearchParams(searchParams);
    if (slug) p.set('category', slug); else p.delete('category');
    p.delete('search');
    setSearchParams(p);
  };

  const activeCategory = categories.find(c => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-800">{activeCategory?.name || (search ? `Tìm kiếm: "${search}"` : 'Tất Cả Sản Phẩm')}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary-700 text-white font-bold px-4 py-3 text-sm uppercase tracking-wide">Danh Mục</div>
            <ul>
              <li>
                <button onClick={() => setFilter('')}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center ${!category ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Tất Cả Sản Phẩm
                  <span className="text-xs text-gray-400">{categories.reduce((s, c) => s + (c.product_count || 0), 0)}</span>
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button onClick={() => setFilter(c.slug)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center border-t border-gray-50 ${category === c.slug ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c.name}
                    <span className="text-xs text-gray-400">{c.product_count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-xl text-gray-800">
              {activeCategory?.name || (search ? `Tìm kiếm: "${search}"` : 'Tất Cả Sản Phẩm')}
            </h1>
            <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🌵</div>
              <p className="font-semibold">Không tìm thấy sản phẩm</p>
              <button onClick={() => setFilter('')} className="mt-4 btn-outline text-sm">Xem tất cả</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => setToast(true)} />)}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message="Đã thêm vào giỏ hàng!" onClose={() => setToast(false)} />}
    </div>
  );
}
