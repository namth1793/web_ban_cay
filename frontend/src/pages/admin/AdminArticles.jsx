import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';

const TYPES = [
  { value: 'care', label: 'Chăm sóc cây' },
  { value: 'info', label: 'Thông tin cây' },
];

const empty = { type: 'care', title: '', summary: '', content: '', image: '', author: '' };

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminApi.articles().then(setArticles);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (a) => {
    setForm({ type: a.type, title: a.title, summary: a.summary || '', content: a.content || '', image: a.image || '', author: a.author || '' });
    setError('');
    setModal(a);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') await adminApi.createArticle(form);
      else await adminApi.updateArticle(modal.id, form);
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Xóa bài viết này?')) return;
    await adminApi.deleteArticle(id);
    await load();
  };

  const typeLabel = (t) => TYPES.find(x => x.value === t)?.label || t;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bài viết</h1>
        <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Thêm bài viết
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Tiêu đề</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Loại</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Lượt xem</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Ngày tạo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {a.image && <img src={a.image} alt="" className="w-10 h-10 object-cover rounded" />}
                    <div>
                      <p className="font-medium text-gray-800 line-clamp-1">{a.title}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{a.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {typeLabel(a.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-500">{a.views}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(a)} className="text-blue-600 hover:underline mr-3">Sửa</button>
                  <button onClick={() => remove(a.id)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Không có bài viết</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal === 'create' ? 'Thêm bài viết' : 'Chỉnh sửa bài viết'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài viết *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tên tác giả..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh bìa</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                  placeholder="Nội dung bài viết (hỗ trợ HTML)..."
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-60">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
