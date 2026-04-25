import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { api } from '../api';

function getSessionId() {
  let id = localStorage.getItem('xrn_session');
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('xrn_session', id);
  }
  return id;
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function ReactionBar({ articleId }) {
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0, user_reaction: null });
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    if (!articleId) return;
    api.getReactions(articleId, sessionId).then(setReactions).catch(() => {});
  }, [articleId]);

  const handleReact = async (type) => {
    if (loading) return;
    setLoading(true);
    try {
      const updated = await api.react(articleId, sessionId, type);
      setReactions(updated);
    } catch {}
    setLoading(false);
  };

  const likeActive = reactions.user_reaction === 'like';
  const dislikeActive = reactions.user_reaction === 'dislike';

  return (
    <div className="flex items-center gap-4 py-5 border-t border-b border-gray-100 my-6">
      <span className="text-sm text-gray-500 font-medium">Bài viết có hữu ích không?</span>
      <button
        onClick={() => handleReact('like')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${likeActive ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'}`}>
        👍 {reactions.likes}
      </button>
      <button
        onClick={() => handleReact('dislike')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${dislikeActive ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500'}`}>
        👎 {reactions.dislikes}
      </button>
      {reactions.user_reaction && (
        <span className="text-xs text-gray-400">(Nhấn lại để bỏ)</span>
      )}
    </div>
  );
}

function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    api.getComments(articleId).then(setComments).catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Vui lòng điền đầy đủ tên và nội dung');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const newComment = await api.postComment(articleId, form);
      setComments(prev => [...prev, newComment]);
      setForm({ author_name: '', content: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold text-gray-800 text-lg mb-5">
        Bình Luận <span className="text-primary-600">({comments.length})</span>
      </h3>

      {/* Comment form */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <p className="font-semibold text-gray-700 text-sm mb-4">Để lại bình luận của bạn</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={form.author_name}
            onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
            placeholder="Họ tên của bạn *"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white"
          />
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Nội dung bình luận *"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white resize-none"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && <p className="text-primary-600 text-xs font-semibold">✅ Bình luận đã được đăng!</p>}
          <button type="submit" disabled={submitting}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {submitting ? 'Đang gửi...' : '💬 Gửi Bình Luận'}
          </button>
        </form>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                  {c.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{c.author_name}</p>
                  <p className="text-gray-400 text-xs">{formatDate(c.created_at)}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

          {/* Reactions */}
          <ReactionBar articleId={data.id} />

          {/* Comments */}
          <CommentSection articleId={data.id} />
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
