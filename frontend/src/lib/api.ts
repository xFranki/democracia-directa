import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  timeout: 10000,
});

// Inyecta el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    }
  }
  return config;
});
