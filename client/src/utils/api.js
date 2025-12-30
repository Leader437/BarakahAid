import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // adjust default if needed
  withCredentials: true, // Important for cookies (refresh tokens)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    // You might store the token in localStorage or memory.
    // Ideally, for security, use httpOnly cookies for everything, but if you have a short-lived access token:
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Optional: Handle token refresh logic here if you decide to implement silent refresh on the client
    // For now, just rejecting.

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Auto-logout on 401
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
