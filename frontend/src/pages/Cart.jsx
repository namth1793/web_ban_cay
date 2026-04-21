import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, api } from '../api';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) { setError('Vui lòng điền đầy đủ thông tin giao hàng'); return; }
    if (!items.length) { setError('Giỏ hàng trống'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.createOrder({
        ...form,
        items: items.map(i => ({ product_id: i.id, product_name: i.name, quantity: i.quantity, price: i.price }))
      });
      setOrderId(res.orderId);
      clearCart();
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Đặt Hàng Thành Công!</h2>
      <p className="text-gray-500 mb-2">Mã đơn hàng: <span className="font-bold text-primary-700">#{orderId}</span></p>
      <p className="text-gray-500 mb-8">Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary">Về Trang Chủ</Link>
        <Link to="/san-pham" className="btn-outline">Tiếp Tục Mua</Link>
      </div>
    </div>
  );

  if (!items.length) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Giỏ Hàng Trống</h2>
      <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng</p>
      <Link to="/san-pham" className="btn-primary">Mua Sắm Ngay</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-800">Giỏ Hàng</span>
      </nav>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Giỏ Hàng ({items.length} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm">
              <Link to={`/san-pham/${item.slug}`} className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://placehold.co/80x80/dcfce7/166534?text=🌵'; }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/san-pham/${item.slug}`} className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 text-sm">{item.name}</Link>
                <p className="text-primary-700 font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                </div>
                <p className="text-sm font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">🗑 Xóa tất cả</button>
          </div>
        </div>

        {/* Order form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-5">Thông Tin Đặt Hàng</h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Phí vận chuyển</span>
              <span className="text-primary-600 font-semibold">Miễn phí</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-primary-700 text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <form onSubmit={handleOrder} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Họ & Tên <span className="text-red-500">*</span></label>
              <input type="text" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                placeholder="Nguyễn Văn A" required
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Số Điện Thoại <span className="text-red-500">*</span></label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="0979.840.050" required
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Địa Chỉ Giao Hàng <span className="text-red-500">*</span></label>
              <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required rows={2}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi Chú</label>
              <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={submitting}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {submitting ? 'Đang đặt hàng...' : '🛍 Đặt Hàng Ngay'}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-3 text-center">Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút</p>
        </div>
      </div>
    </div>
  );
}
