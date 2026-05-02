const BASE = `${import.meta.env.VITE_API_URL || ''}/api/admin`;

function getToken() {
  return localStorage.getItem('xrn_admin_token');
}

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Lỗi server');
  return data;
}

export const adminApi = {
  login: (username, password) => req('POST', '/login', { username, password }),
  stats: () => req('GET', '/stats'),

  products: () => req('GET', '/products'),
  createProduct: (data) => req('POST', '/products', data),
  updateProduct: (id, data) => req('PUT', `/products/${id}`, data),
  deleteProduct: (id) => req('DELETE', `/products/${id}`),

  articles: () => req('GET', '/articles'),
  createArticle: (data) => req('POST', '/articles', data),
  updateArticle: (id, data) => req('PUT', `/articles/${id}`, data),
  deleteArticle: (id) => req('DELETE', `/articles/${id}`),

  orders: () => req('GET', '/orders'),
  updateOrderStatus: (id, status) => req('PUT', `/orders/${id}/status`, { status }),

  contacts: () => req('GET', '/contacts'),

  categories: () => req('GET', '/categories'),
  createCategory: (data) => req('POST', '/categories', data),
  updateCategory: (id, data) => req('PUT', `/categories/${id}`, data),
  deleteCategory: (id) => req('DELETE', `/categories/${id}`),

  banners: () => req('GET', '/banners'),
  createBanner: (data) => req('POST', '/banners', data),
  updateBanner: (id, data) => req('PUT', `/banners/${id}`, data),
  deleteBanner: (id) => req('DELETE', `/banners/${id}`),

  getSettings: () => req('GET', '/settings'),
  updateSettings: (data) => req('PUT', '/settings', data),

  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(BASE + '/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload thất bại');
    return data;
  },
};

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem('xrn_admin_token');
}

export function saveToken(token) {
  localStorage.setItem('xrn_admin_token', token);
}
