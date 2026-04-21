import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-primary-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-once">
      <span className="text-lg">🛒</span>
      <span className="font-semibold text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}
