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

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Return data directly from API responses
  (error) => {
    // If 401, maybe logout admin
    if (error.response?.status === 401) {
      // dispatch logout action if we had access to store, or just clear storage
      // localStorage.removeItem('adminAccessToken');
      // localStorage.removeItem('adminUser');
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
