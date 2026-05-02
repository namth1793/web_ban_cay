import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import ImageUploader from '../../components/ImageUploader';

const empty = { name: '', description: '', image: '', sort_order: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminApi.categories().then(setCategories);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', image: c.image || '', sort_order: c.sort_order ?? 0 });
    setError('');
    setModal(c);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form, sort_order: Number(form.sort_order) };
      if (modal === 'create') await adminApi.createCategory(data);
      else await adminApi.updateCategory(modal.id, data);
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Xóa danh mục này?')) return;
    try {
      await adminApi.deleteCategory(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh mục sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý danh mục hiển thị trên trang sản phẩm</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium w-12">STT</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Danh mục</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium hidden md:table-cell">Mô tả</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium hidden md:table-cell">Slug</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center text-gray-500">{c.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {c.image ? (
                      <img src={c.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-lg flex-shrink-0">🌿</div>
                    )}
                    <span className="font-medium text-gray-800">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell line-clamp-1 max-w-[200px]">
                  {c.description || '—'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{c.slug}</span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline mr-3">Sửa</button>
                  <button onClick={() => remove(c.id)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={f('name')}
                  required
                  placeholder="VD: Xương Rồng Mini"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {modal === 'create' && form.name && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug sẽ được tự tạo từ tên danh mục
                  </p>
                )}
                {modal !== 'create' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug hiện tại: <span className="font-mono">{modal.slug}</span> (không thay đổi khi sửa)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={f('description')}
                  rows={2}
                  placeholder="Mô tả ngắn về danh mục..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                <ImageUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={f('sort_order')}
                  min={0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">Số nhỏ hơn hiển thị trước</p>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-60">
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
