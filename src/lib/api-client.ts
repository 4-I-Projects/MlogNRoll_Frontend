/// <reference types="vite/client" />
import axios from 'axios';

// Cần đảm bảo biến môi trường này được thiết lập (hoặc dùng fallback localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Lấy token mà AuthProvider đã lưu vào localStorage ở bước App.tsx
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);