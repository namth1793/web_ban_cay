const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

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

  getBanners: () => fetch(`${BASE}/banners`).then(r => r.json()),

  // Reactions
  getReactions: (articleId, sessionId) =>
    fetch(`${BASE}/articles/${articleId}/reactions?session_id=${sessionId}`).then(r => r.json()),
  react: (articleId, sessionId, reactionType) =>
    fetch(`${BASE}/articles/${articleId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, reaction_type: reactionType }),
    }).then(r => r.json()),

  // Comments
  getComments: (articleId) => fetch(`${BASE}/articles/${articleId}/comments`).then(r => r.json()),
  postComment: (articleId, data) =>
    fetch(`${BASE}/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};

export const formatPrice = (n) => n?.toLocaleString('vi-VN') + 'đ';
export const discount = (price, orig) => orig ? Math.round((1 - price / orig) * 100) : 0;
