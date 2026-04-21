import { Link } from 'react-router-dom';

export default function BlogCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Link to={`/bai-viet/${article.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group block">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://placehold.co/600x400/dcfce7/166534?text=🌿'; }}
        />
      </div>
      <div className="p-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${article.type === 'cham-soc' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {article.type === 'cham-soc' ? 'Chăm Sóc' : 'Thông Tin'}
        </span>
        <h3 className="mt-2 font-bold text-gray-800 line-clamp-2 leading-snug">{article.title}</h3>
        <p className="mt-2 text-gray-500 text-sm line-clamp-2">{article.summary}</p>
        <p className="mt-3 text-xs text-gray-400">{date}</p>
      </div>
    </Link>
  );
}
