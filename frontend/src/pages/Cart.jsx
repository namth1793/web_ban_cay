import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, api } from '../api';

function formatPricePlain(n) {
  return (n || 0).toLocaleString('vi-VN') + 'đ';
}

function downloadInvoice(orderResult, form) {
  const W = 620;
  const padding = 28;
  const items = orderResult.items || [];
  const H = 490 + items.length * 30 + (form.note ? 26 : 0);

  const canvas = document.createElement('canvas');
  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const txt = (text, x, y, font, color = '#1f2937', align = 'left') => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  };
  const line = (y, color = '#d1fae5', w = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(W - padding, y);
    ctx.stroke();
  };

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Green header
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 0, W, 78);
  txt('XUONG RONG NONG LAM', W / 2, 30, 'bold 20px Arial', '#ffffff', 'center');
  txt('HOA DON DAT HANG', W / 2, 52, '13px Arial', '#bbf7d0', 'center');
  txt(`Ma don: #${orderResult.orderId}`, W / 2, 70, 'bold 12px Arial', '#ffffff', 'center');

  let y = 88;

  // Date & status
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN');
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  txt(`Ngay dat hang: ${dateStr} ${timeStr}`, padding, y, '12px Arial', '#374151');
  txt('Trang thai: Cho xac nhan', W - padding, y, '12px Arial', '#d97706', 'right');

  y += 18;
  line(y);
  y += 14;

  // Customer info
  txt('THONG TIN KHACH HANG', padding, y, 'bold 12px Arial', '#166534');
  y += 20;
  txt(`Ho ten: ${form.customer_name}`, padding, y, '13px Arial');
  y += 22;
  txt(`So dien thoai: ${form.phone}`, padding, y, '13px Arial');
  y += 22;

  // Address - truncate if too long
  const addrFull = form.address;
  ctx.font = '13px Arial';
  const maxAddrW = W - padding * 2 - 60;
  let addr = addrFull;
  if (ctx.measureText('Dia chi: ' + addr).width > maxAddrW) {
    while (ctx.measureText('Dia chi: ' + addr + '...').width > maxAddrW && addr.length > 0) {
      addr = addr.slice(0, -1);
    }
    addr += '...';
  }
  txt(`Dia chi: ${addr}`, padding, y, '13px Arial');
  y += 22;

  if (form.note) {
    txt(`Ghi chu: ${form.note}`, padding, y, 'italic 12px Arial', '#6b7280');
    y += 26;
  }

  y += 4;
  line(y);
  y += 14;

  // Products
  txt('CHI TIET DON HANG', padding, y, 'bold 12px Arial', '#166534');
  y += 20;

  // Table header
  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(padding - 4, y - 2, W - (padding - 4) * 2, 26);
  txt('San pham', padding + 4, y + 16, 'bold 11px Arial', '#166534');
  txt('SL', W - 185, y + 16, 'bold 11px Arial', '#166534', 'center');
  txt('Don gia', W - 120, y + 16, 'bold 11px Arial', '#166534', 'right');
  txt('Thanh tien', W - padding, y + 16, 'bold 11px Arial', '#166534', 'right');
  y += 26;

  // Item rows
  items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(padding - 4, y - 2, W - (padding - 4) * 2, 28);
    }
    ctx.font = '12px Arial';
    const maxNameW = W - 220 - padding;
    let name = item.name;
    if (ctx.measureText(name).width > maxNameW) {
      while (ctx.measureText(name + '...').width > maxNameW && name.length > 0) name = name.slice(0, -1);
      name += '...';
    }
    txt(name, padding + 4, y + 17, '12px Arial', '#1f2937');
    txt(String(item.quantity), W - 185, y + 17, '12px Arial', '#374151', 'center');
    txt(formatPricePlain(item.price), W - 120, y + 17, '12px Arial', '#374151', 'right');
    txt(formatPricePlain(item.price * item.quantity), W - padding, y + 17, '12px Arial', '#374151', 'right');
    y += 28;
  });

  y += 8;
  line(y);
  y += 14;

  // Totals
  txt('Tam tinh:', W - 160, y, '12px Arial', '#6b7280', 'right');
  txt(formatPricePlain(orderResult.total), W - padding, y, '12px Arial', '#374151', 'right');
  y += 22;
  txt('Phi van chuyen:', W - 160, y, '12px Arial', '#6b7280', 'right');
  txt('MIEN PHI', W - padding, y, '12px Arial', '#16a34a', 'right');
  y += 8;

  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(padding - 4, y, W - (padding - 4) * 2, 32);
  txt('TONG CONG:', W - 160, y + 21, 'bold 14px Arial', '#166534', 'right');
  txt(formatPricePlain(orderResult.total), W - padding, y + 21, 'bold 16px Arial', '#16a34a', 'right');
  y += 32;

  y += 12;
  line(y, '#16a34a', 2);
  y += 16;

  // Footer
  txt('Cam on quy khach da tin tuong Xuong Rong Nong Lam!', W / 2, y, '11px Arial', '#6b7280', 'center');
  y += 18;
  txt('Shop se lien he lai qua so dien thoai de xac nhan don hang.', W / 2, y, 'italic 11px Arial', '#9ca3af', 'center');
  y += 18;
  txt('Hotline: 0979.840.050  |  0337.123.030', W / 2, y, 'bold 12px Arial', '#16a34a', 'center');

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoa-don-${orderResult.orderId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    if (!items.length) { setError('Giỏ hàng trống'); return; }
    setError('');
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    setShowModal(false);
    setSubmitting(true);
    const savedItems = items.map(i => ({ ...i }));
    const savedForm = { ...form };
    try {
      const res = await api.createOrder({
        ...form,
        items: items.map(i => ({ product_id: i.id, product_name: i.name, quantity: i.quantity, price: i.price })),
      });
      setOrderResult({ orderId: res.orderId, total: res.total, items: savedItems, form: savedForm });
      clearCart();
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  // Success + Invoice screen
  if (orderResult) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Đặt Hàng Thành Công!</h2>
        <p className="text-gray-500">Mã đơn hàng: <span className="font-bold text-primary-700">#{orderResult.orderId}</span></p>
      </div>

      {/* Notification banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex gap-3 items-start">
        <span className="text-2xl mt-0.5">📞</span>
        <div>
          <p className="font-bold text-amber-800 mb-1">Thông báo xác nhận đơn hàng</p>
          <p className="text-amber-700 text-sm">Shop sẽ liên hệ lại khách hàng thông qua số điện thoại để xác nhận đơn hàng. Vui lòng để ý điện thoại!</p>
        </div>
      </div>

      {/* Invoice preview */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="bg-primary-700 text-white px-6 py-4 text-center">
          <p className="font-extrabold text-lg tracking-wide">XƯƠNG RỒNG NÔNG LÂM</p>
          <p className="text-primary-200 text-sm">HÓA ĐƠN ĐẶT HÀNG — #{orderResult.orderId}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Customer */}
          <div>
            <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-2">Thông Tin Khách Hàng</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="text-gray-400">Họ tên:</span> <span className="font-semibold">{orderResult.form.customer_name}</span></p>
              <p><span className="text-gray-400">SĐT:</span> <span className="font-semibold">{orderResult.form.phone}</span></p>
              <p><span className="text-gray-400">Địa chỉ:</span> {orderResult.form.address}</p>
              {orderResult.form.note && <p><span className="text-gray-400">Ghi chú:</span> {orderResult.form.note}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-2">Chi Tiết Đơn Hàng</p>
            <div className="space-y-2">
              {orderResult.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 flex-1 mr-2 line-clamp-1">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-semibold text-gray-800 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Phí vận chuyển</span>
            <span className="text-sm font-semibold text-primary-600">Miễn phí</span>
          </div>
          <div className="bg-primary-50 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-gray-800">Tổng cộng</span>
            <span className="font-extrabold text-primary-700 text-xl">{formatPrice(orderResult.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => downloadInvoice(orderResult, orderResult.form)}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
          💾 Lưu Hóa Đơn
        </button>
        <Link to="/" className="flex-1 btn-outline py-3 text-center">Về Trang Chủ</Link>
        <Link to="/san-pham" className="flex-1 btn-outline py-3 text-center">Tiếp Tục Mua</Link>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Nhấn "Lưu Hóa Đơn" để tải ảnh hóa đơn về máy</p>
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
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">📞</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Xác Nhận Đặt Hàng</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
                <p className="text-amber-800 font-semibold text-sm">Thông báo:</p>
                <p className="text-amber-700 text-sm mt-1">
                  Shop sẽ liên hệ lại khách hàng thông qua số điện thoại để xác nhận đơn hàng.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm space-y-1">
              <p className="text-gray-600"><span className="font-semibold">Khách hàng:</span> {form.customer_name}</p>
              <p className="text-gray-600"><span className="font-semibold">SĐT:</span> {form.phone}</p>
              <p className="text-gray-600"><span className="font-semibold">Tổng tiền:</span> <span className="text-primary-700 font-bold">{formatPrice(total)}</span></p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleConfirmOrder}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors">
                Xác Nhận Đặt Hàng
              </button>
            </div>
          </div>
        </div>
      )}

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

          <form onSubmit={handleCheckoutClick} className="space-y-3">
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

          <p className="text-xs text-gray-400 mt-3 text-center">Shop sẽ liên hệ xác nhận qua số điện thoại</p>
        </div>
      </div>
    </div>
  );
}
