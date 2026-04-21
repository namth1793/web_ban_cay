const BASE = '/api';

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products${q ? '?' + q : ''}`).then(r => r.json());
  },
  getProduct: (slug) => fetch(`${BASE}/products/${slug}`).then(r => r.json()),
  getCategories: () => fetch(`${BASE}/categories`).then(r => r.json()),
  getArticles: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/articles${q ? '?' + q : ''}`).then(r => r.json());
  },
  getArticle: (slug) => fetch(`${BASE}/articles/${slug}`).then(r => r.json()),
  submitContact: (data) => fetch(`${BASE}/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  createOrder: (data) => fetch(`${BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
};

export const formatPrice = (n) => n?.toLocaleString('vi-VN') + 'đ';
export const discount = (price, orig) => orig ? Math.round((1 - price / orig) * 100) : 0;
