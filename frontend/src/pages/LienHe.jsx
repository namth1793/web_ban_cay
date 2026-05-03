import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function LienHe() {
  const { contact_phone, contact_address } = useSiteSettings();
  const phone = contact_phone || '096.1144.560';
  const phoneTel = phone.replace(/[^0-9]/g, '');
  const address = contact_address || 'TP. Hồ Chí Minh';
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) { setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-800">Liên Hệ</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-gray-500 mb-8">Chúng tôi sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay!</p>

          <div className="space-y-5">
            {[
              { icon: '📍', label: 'Địa chỉ', value: address, href: null },
              { icon: '📞', label: 'Điện thoại', value: phone, href: `tel:${phoneTel}` },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-gray-800 font-semibold hover:text-primary-600 transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-gray-800 font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a href={`https://zalo.me/${phoneTel}`} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              💬 Chat Zalo
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Gửi Tin Nhắn</h2>

          {success ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Gửi Thành Công!</h3>
              <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
              <button onClick={() => setSuccess(false)} className="btn-primary">Gửi Tin Nhắn Khác</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ & Tên <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nguyễn Văn A" required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0979840050"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nội Dung <span className="text-red-500">*</span></label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tôi muốn hỏi về..." required rows={5}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200 resize-none" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Đang gửi...' : '📤 Gửi Tin Nhắn'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
