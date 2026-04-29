import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import ImageUploader from '../../components/ImageUploader';

const GRADIENTS = [
  { label: 'Xanh lá đậm', value: 'from-primary-900 via-primary-800 to-teal-700' },
  { label: 'Emerald xanh', value: 'from-emerald-900 via-green-800 to-teal-700' },
  { label: 'Lime tươi', value: 'from-lime-900 via-green-800 to-emerald-700' },
  { label: 'Teal đại dương', value: 'from-teal-900 via-green-800 to-primary-700' },
  { label: 'Xám tối', value: 'from-gray-900 via-gray-800 to-gray-700' },
  { label: 'Indigo tím', value: 'from-indigo-900 via-indigo-800 to-blue-700' },
];

const empty = {
  title: '', description: '', tag: '', image: '',
  link: '/san-pham', cta_text: 'Xem ngay',
  bg_gradient: 'from-primary-900 via-primary-800 to-teal-700',
  sort_order: 0, active: true,
};

export default function AdminBanner() {
  const [banners, setBanners] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminApi.banners().then(setBanners);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (b) => {
    setForm({
      title: b.title, description: b.description || '', tag: b.tag || '',
      image: b.image, link: b.link || '/san-pham', cta_text: b.cta_text || 'Xem ngay',
      bg_gradient: b.bg_gradient || empty.bg_gradient,
      sort_order: b.sort_order ?? 0, active: b.active !== 0,
    });
    setError('');
    setModal(b);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, active: form.active ? 1 : 0 };
      if (modal === 'create') await adminApi.createBanner(payload);
      else await adminApi.updateBanner(modal.id, payload);
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Xóa banner này?')) return;
    await adminApi.deleteBanner(id);
    await load();
  };

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const fCheck = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.checked }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banner Hero</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý các banner hiển thị trên trang chủ</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Thêm banner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Banner</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Tag / Link</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Thứ tự</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Trạng thái</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={b.image} alt="" className="w-20 h-12 object-cover rounded-lg flex-shrink-0" onError={e => { e.target.style.display = 'none'; }} />
                    <div>
                      <p className="font-medium text-gray-800">{b.title}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{b.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {b.tag && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium block w-fit mb-1">{b.tag}</span>}
                  <span className="text-gray-400 text-xs">{b.link}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{b.sort_order}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(b)} className="text-blue-600 hover:underline mr-3">Sửa</button>
                  <button onClick={() => remove(b.id)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Chưa có banner nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal === 'create' ? 'Thêm banner' : 'Chỉnh sửa banner'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                  <input type="text" value={form.title} onChange={f('title')} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag nhãn</label>
                  <input type="text" value={form.tag} onChange={f('tag')} placeholder="VD: Xương Rồng Mini"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nút CTA</label>
                  <input type="text" value={form.cta_text} onChange={f('cta_text')} placeholder="VD: Xem ngay"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea value={form.description} onChange={f('description')} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh banner *</label>
                <ImageUploader value={form.image} onChange={url => setForm(prev => ({ ...prev, image: url }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link khi click</label>
                <input type="text" value={form.link} onChange={f('link')} placeholder="/san-pham"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền gradient</label>
                <select value={form.bg_gradient} onChange={f('bg_gradient')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {GRADIENTS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                  <input type="number" value={form.sort_order} onChange={f('sort_order')} min={0}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="active" checked={form.active} onChange={fCheck('active')} className="w-4 h-4 accent-green-600" />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">Hiển thị banner</label>
                </div>
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
