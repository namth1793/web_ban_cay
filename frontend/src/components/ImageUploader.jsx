import { useRef, useState } from 'react';
import { adminApi } from '../adminApi';

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await adminApi.upload(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition disabled:opacity-60"
        >
          {uploading ? 'Đang upload...' : '📁 Chọn ảnh'}
        </button>
        {value && (
          <span className="text-xs text-gray-400 truncate max-w-[220px]">{value.split('/').pop()}</span>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {value && (
        <img
          src={value}
          alt="preview"
          className="mt-2 w-full h-36 object-cover rounded-lg"
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
    </div>
  );
}
