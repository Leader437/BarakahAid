// Admin API Helper - Real API Implementation
import axios from 'axios';

// Create an Axios instance for Admin
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with silent token refresh
api.interceptors.response.use(
  (response) => response.data, // Return data directly from API responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get admin user ID from localStorage for refresh request
        const userData = localStorage.getItem('adminUser');
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
            localStorage.setItem('adminAccessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - fall through to logout
      }

      // Clear admin auth data and redirect to login
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Dashboard & Overview
 */
export const getOverview = async () => {
  return await api.get('/admin/analytics');
};

export const getAnalyticsUsers = async () => {
  return await api.get('/admin/analytics/users');
};

export const getAnalyticsActivity = async (limit = 10) => {
  return await api.get(`/admin/analytics/activity?limit=${limit}`);
};

export const getReports = async () => {
  return await api.get('/admin/reports');
};

/**
 * Users Management
 */
export const getUsers = async (params = {}) => {
  return await api.get('/users', { params });
};

export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

export const updateUserStatus = async (id, status) => {
  return await api.put(`/users/${id}/status`, { status });
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

/**
 * Donations Management
 */
export const getDonations = async (params = {}) => {
  return await api.get('/donations', { params });
};

export const getDonationById = async (id) => {
  return await api.get(`/donations/${id}`);
};

export const updateDonationStatus = async (id, status) => {
  return await api.put(`/donations/${id}/status`, { status });
};

/**
 * Requests Management
 */
export const getRequests = async (params = {}) => {
  return await api.get('/requests', { params }); // Assuming module name is requests
};

export const getRequestById = async (id) => {
  return await api.get(`/requests/${id}`);
};

export const approveRequest = async (id) => {
  return await api.post(`/requests/${id}/approve`);
};

export const rejectRequest = async (id) => {
  return await api.post(`/requests/${id}/reject`);
};

/**
 * Campaigns Management
 */
export const getCampaigns = async (params = {}) => {
  return await api.get('/campaigns', { params });
};

export const getCampaignById = async (id) => {
  return await api.get(`/campaigns/${id}`);
};

export const updateCampaignStatus = async (id, status) => {
  return await api.put(`/campaigns/${id}/status`, { status });
};

export const publishCampaign = async (id) => {
  return await api.put(`/campaigns/${id}/publish`); // or status update
};

export const cancelCampaign = async (id) => {
  return await api.put(`/campaigns/${id}/cancel`); // or status update
};

// Export the axios instance as default or named for flexibility
export { api };

const adminApi = {
  getOverview,
  getReports,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDonations,
  getDonationById,
  updateDonationStatus,
  getRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  getCampaigns,
  getCampaignById,
  updateCampaignStatus,
  publishCampaign,
  cancelCampaign,
  api // exposing the raw instance just in case
};

export default adminApi;
