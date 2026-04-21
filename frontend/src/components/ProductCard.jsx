import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, discount } from '../api';

export default function ProductCard({ product, onAddToCart }) {
  const { addItem } = useCart();
  const disc = discount(product.price, product.original_price);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    onAddToCart?.();
  };

  return (
    <Link to={`/san-pham/${product.slug}`} className="product-card group block">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://placehold.co/400x400/dcfce7/166534?text=🌵'; }}
        />
        {disc > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{disc}%
          </span>
        )}
        {product.featured === 1 && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Nổi bật
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category_name}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary-700 font-bold">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-gray-400 text-xs line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="w-full text-xs font-semibold py-2 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white border border-primary-200 hover:border-primary-600 rounded-lg transition-colors duration-200"
        >
          🛒 Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
}
