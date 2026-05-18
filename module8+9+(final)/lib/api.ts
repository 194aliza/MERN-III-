/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MERN III - Unified API Client
 * All frontend API calls go through this file
 * This makes it easy to switch between mock and real backend
 */
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = {
  // 🛍️ PRODUCTS
  async getProducts(params?: { page?: number; limit?: number; search?: string; category?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);

    const response = await fetch(`${API_BASE}/products?${query}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getProduct(id: string) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    return response.json();
  },

  async createProduct(data: any) {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async updateProduct(id: string, data: any) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/products/stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },

  // 👤 AUTH (Module 4)
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  // 🛒 ORDERS (Module 6)
  async createOrder(items: any[]) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
},

  async getMyOrders() {
  const response = await fetch(`${API_BASE}/orders/my`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
},

  // ⭐ REVIEWS (Module 6)
  async addReview(productId: string, rating: number, comment: string) {
    const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    if (!response.ok) throw new Error("Failed to add review");
    return response.json();
  },

  // 🏥 HEALTH
  async checkHealth() {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default api;
