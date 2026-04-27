import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';

const STATUSES = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipping', label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
];

const statusInfo = (s) => STATUSES.find(x => x.value === s) || { label: s, color: 'bg-gray-100 text-gray-600' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => adminApi.orders().then(setOrders);
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await adminApi.updateOrderStatus(id, status);
    await load();
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Lọc:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tất cả</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(order => {
          const st = statusInfo(order.status);
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">#{order.id}</span>
                    <span className="font-medium text-gray-700">{order.customer_name}</span>
                    <span className="text-gray-400 text-sm">{order.phone}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{order.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-700">{order.total.toLocaleString('vi-VN')} ₫</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div className="border-t px-4 py-4 space-y-3">
                  {order.note && <p className="text-sm text-gray-600"><span className="font-medium">Ghi chú:</span> {order.note}</p>}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm đặt:</p>
                    <div className="space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.product_name} × {item.quantity}</span>
                          <span className="text-gray-600 font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Cập nhật trạng thái:</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button
                          key={s.value}
                          onClick={() => changeStatus(order.id, s.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                            order.status === s.value
                              ? `${s.color} border-current`
                              : 'border-gray-200 text-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">Không có đơn hàng</div>
        )}
      </div>
    </div>
  );
}
