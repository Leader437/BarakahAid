// Admin Slice - Admin info from JWT (no login logic)
import { createSlice } from '@reduxjs/toolkit';
import { mockAnalytics } from '../../../client/src/utils/dummyData';

/**
 * Admin slice stores only admin info (id, email, role) extracted from existing JWT
 * Authentication is handled by client app - this just manages admin state
 */
const initialState = {
  // Admin info from JWT token
  admin: null, // { id, email, name, role }
  
  // Dashboard stats (from mock data for now)
  dashboardStats: {
    totalUsers: mockAnalytics.totalUsers,
    totalDonations: mockAnalytics.totalDonations,
    activeCampaigns: mockAnalytics.activeCampaigns,
    pendingRequests: mockAnalytics.pendingRequests,
  },
  
  // Analytics data
  monthlyDonations: mockAnalytics.monthlyDonations,
  usersByRole: mockAnalytics.usersByRole,
  recentActivity: mockAnalytics.recentActivity,
  
  // UI state
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    /**
     * Set admin data extracted from JWT token
     * @param {Object} payload - { id, email, name, role }
     */
    setAdminData: (state, action) => {
      state.admin = {
        id: action.payload.id || action.payload.sub,
        email: action.payload.email,
        name: action.payload.name,
        role: action.payload.role,
      };
    },

    /**
     * Clear admin data on logout
     * Also clears localStorage (handled in component)
     */
    logout: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
    },

    // Dashboard stats actions
    setDashboardStats: (state, action) => {
      state.dashboardStats = { ...state.dashboardStats, ...action.payload };
    },

    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  setAdminData,
  logout,
  setDashboardStats,
  setRecentActivity,
  setLoading,
  setError,
} = adminSlice.actions;

// Selectors
export const selectAdmin = (state) => state.admin.admin;
export const selectIsAuthenticated = (state) => !!state.admin.admin;
export const selectDashboardStats = (state) => state.admin.dashboardStats;
export const selectMonthlyDonations = (state) => state.admin.monthlyDonations;
export const selectUsersByRole = (state) => state.admin.usersByRole;
export const selectRecentActivity = (state) => state.admin.recentActivity;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
