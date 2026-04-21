import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { api } from '../api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getArticle(slug).then(setData).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-12 bg-gray-100 rounded mb-4 animate-pulse" />
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  );

  if (!data || data.error) return (
    <div className="text-center py-24 text-gray-400">
      <div className="text-5xl mb-4">📄</div>
      <p>Không tìm thấy bài viết</p>
      <Link to="/" className="mt-4 btn-primary inline-block">Về trang chủ</Link>
    </div>
  );

  const typeLabel = data.type === 'cham-soc' ? 'Chăm Sóc' : 'Thông Tin';
  const typePath = data.type === 'cham-soc' ? '/cham-soc' : '/thong-tin';
  const date = new Date(data.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link to={typePath} className="hover:text-primary-600">{typeLabel}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 font-medium line-clamp-1">{data.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${data.type === 'cham-soc' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {typeLabel}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3 mb-2">{data.title}</h1>
          <p className="text-gray-400 text-sm mb-6">{date} · {data.views} lượt xem</p>

          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://placehold.co/800x450/dcfce7/166534?text=🌿'; }} />
          </div>

          <p className="text-gray-500 italic border-l-4 border-primary-400 pl-4 mb-6">{data.summary}</p>

          <div
            className="prose prose-green max-w-none text-gray-700 leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-primary-800 [&>h2]:mt-6 [&>h2]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </article>

        {/* Sidebar related */}
        <aside>
          <div className="sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Bài Viết Liên Quan</h3>
            <div className="space-y-4">
              {data.related?.map(a => <BlogCard key={a.id} article={{ ...a, type: data.type }} />)}
            </div>
            <div className="mt-6 bg-primary-50 border border-primary-100 rounded-xl p-4">
              <p className="font-bold text-primary-800 mb-1">📞 Cần tư vấn?</p>
              <p className="text-primary-700 text-sm mb-3">Liên hệ ngay để được hỗ trợ chăm sóc cây miễn phí</p>
              <a href="tel:0979840050" className="block text-center bg-primary-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                0979.840.050
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
