import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api', // adjust default if needed
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get user ID from localStorage for refresh request
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (user?.id) {
          // Attempt to refresh the token using the refresh token cookie
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
            { userId: user.id },
            { withCredentials: true }
          );

          const newAccessToken = response.data?.accessToken || response.data?.data?.accessToken;

          if (newAccessToken) {
            // Store new token and retry the original request
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - fall through to logout
      }

      // Clear auth data and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
