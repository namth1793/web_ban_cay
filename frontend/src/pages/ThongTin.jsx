import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { api } from '../api';

export default function ThongTin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArticles({ type: 'thong-tin', limit: 20 }).then(setArticles).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-800">Thông Tin Hữu Ích</span>
      </nav>

      <div className="bg-gradient-to-r from-teal-700 to-cyan-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-extrabold mb-2">Thông Tin Hữu Ích</h1>
        <p className="text-teal-100">Kiến thức về cây xương rồng, phong thủy và lựa chọn quà tặng</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-400 py-16">Chưa có bài viết nào</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(a => <BlogCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
