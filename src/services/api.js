const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('olaflex_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (fetchErr) {
    throw new Error(`Network error: ${fetchErr.message}. Is the backend server running?`);
  }

  if (res.status === 401) {
    localStorage.removeItem('olaflex_token');
    localStorage.removeItem('olaflex_user');
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth
export const authAPI = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Products
export const productsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, val);
      }
    });
    const qs = searchParams.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getOne: (id) => request(`/products/${id}`),
  create: (data) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
  deleteAll: () =>
    request('/admin/products', {
      method: 'DELETE',
    }),
};

// Images
export const imagesAPI = {
  upload: (productId, data) =>
    request(`/products/${productId}/images`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  setPrimary: (imageId) =>
    request(`/images/${imageId}/primary`, {
      method: 'PUT',
    }),
  delete: (imageId) =>
    request(`/images/${imageId}`, {
      method: 'DELETE',
    }),
};

// Brands
export const brandsAPI = {
  getAll: () => request('/brands'),
};

// Admin stats
export const statsAPI = {
  get: () => request('/admin/stats'),
};

// WhatsApp helper
export function getWhatsAppUrl(product) {
  const message = encodeURIComponent(
    `Hello OLAFLEX,\n\nI would like to order:\n\nProduct: ${product.name}\nBrand: ${product.brand}\nPrice: ₦${product.price?.toLocaleString()}\nReference: ${product.reference || 'N/A'}\n\nPlease confirm availability and delivery information.`
  );
  return `https://wa.me/2349054318483?text=${message}`;
}

export function getWhatsAppGeneralUrl() {
  const message = encodeURIComponent(
    "Hello OLAFLEX, I'd like to inquire about your products."
  );
  return `https://wa.me/2349054318483?text=${message}`;
}
