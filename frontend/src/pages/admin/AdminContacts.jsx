import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { adminApi.contacts().then(setContacts); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Liên hệ ({contacts.length})</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Tên</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">SĐT</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Ngày gửi</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map(c => (
              <>
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {expanded === c.id ? 'Ẩn' : 'Xem tin nhắn'}
                    </button>
                  </td>
                </tr>
                {expanded === c.id && (
                  <tr key={`${c.id}-msg`}>
                    <td colSpan={5} className="px-4 pb-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm whitespace-pre-wrap">
                        {c.message}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {contacts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Chưa có liên hệ nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
