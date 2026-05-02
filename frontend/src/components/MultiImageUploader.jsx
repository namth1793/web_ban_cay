import { useRef, useState } from 'react';
import { adminApi } from '../adminApi';

export default function MultiImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const urls = await Promise.all(files.map(f => adminApi.upload(f).then(r => r.url)));
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  const moveFirst = (idx) => {
    if (idx === 0) return;
    const next = [...value];
    [next[0], next[idx]] = [next[idx], next[0]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-square">
            <img
              src={url} alt=""
              className="w-full h-full object-cover rounded-lg border border-gray-200"
              onError={e => { e.target.src = 'https://placehold.co/200x200/dcfce7/166534?text=?'; }}
            />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-medium pointer-events-none">
                Chính
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => moveFirst(i)}
                  className="bg-white text-gray-800 text-xs px-2 py-1 rounded font-medium hover:bg-gray-100"
                >
                  Đặt chính
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-base"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-gray-300 hover:border-green-500 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-green-600 transition disabled:opacity-60 cursor-pointer"
        >
          {uploading ? (
            <span className="text-xs text-center px-1">Đang tải...</span>
          ) : (
            <>
              <span className="text-3xl leading-none mb-1">+</span>
              <span className="text-xs">Thêm ảnh</span>
            </>
          )}
        </button>
      </div>

      {value.length > 0 && (
        <p className="text-xs text-gray-400 mb-1">Hover vào ảnh để đặt ảnh chính hoặc xóa</p>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
    </div>
  );
}
