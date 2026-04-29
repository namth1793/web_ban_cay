import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';

const FIELDS = [
  { key: 'site_name', label: 'Tên website (hiển thị trên tab trình duyệt)', required: true },
  { key: 'site_tagline', label: 'Khẩu hiệu ngắn' },
  { key: 'contact_phone', label: 'Số điện thoại' },
  { key: 'contact_email', label: 'Email liên hệ' },
  { key: 'contact_address', label: 'Địa chỉ' },
];

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getSettings().then(setForm).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await adminApi.updateSettings(form);
      setSuccess(true);
      if (form.site_name) document.title = form.site_name;
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Cài đặt website</h1>
      <p className="text-sm text-gray-500 mb-6">Thông tin này hiển thị trên trình duyệt và toàn bộ website.</p>

      <form onSubmit={save} className="bg-white rounded-xl shadow p-6 space-y-5">
        {FIELDS.map(({ key, label, required }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={form[key] || ''}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              required={required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm font-semibold">✅ Đã lưu thành công!</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </form>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">💡 Lưu ý về dữ liệu sau khi redeploy</p>
        <p>Dữ liệu được lưu trong database. Để không mất dữ liệu khi redeploy, hãy dùng <strong>PostgreSQL</strong> (thêm <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code> vào biến môi trường) thay vì SQLite mặc định.</p>
      </div>
    </div>
  );
}
