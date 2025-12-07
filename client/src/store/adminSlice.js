// Admin Slice - Admin management and analytics
import { createSlice } from '@reduxjs/toolkit';
import { mockUsers, mockVerificationRequests, mockAnalytics } from '../utils/dummyData';

const initialState = {
  users: [...mockUsers],
  verificationRequests: [...mockVerificationRequests],
  analytics: mockAnalytics,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    setVerificationRequests: (state, action) => {
      state.verificationRequests = action.payload;
    },
    updateVerificationRequest: (state, action) => {
      const index = state.verificationRequests.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.verificationRequests[index] = { ...state.verificationRequests[index], ...action.payload };
      }
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
  },
});

// Mock async actions
export const fetchUsers = (filters = {}) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filtered = [...mockUsers];
  
  if (filters.role) {
    filtered = filtered.filter((u) => u.role === filters.role);
  }
  if (filters.verified !== undefined) {
    filtered = filtered.filter((u) => u.verified === filters.verified);
  }
  
  dispatch(setUsers(filtered));
  dispatch(setLoading(false));
};

export const fetchVerificationRequests = () => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  dispatch(setVerificationRequests(mockVerificationRequests));
  dispatch(setLoading(false));
};

export const approveVerification = (requestId) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  dispatch(updateVerificationRequest({ id: requestId, status: 'verified' }));
  dispatch(setLoading(false));
  return { success: true };
};

export const rejectVerification = (requestId, reason) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  dispatch(updateVerificationRequest({ id: requestId, status: 'rejected', rejectionReason: reason }));
  dispatch(setLoading(false));
  return { success: true };
};

export const fetchAnalytics = () => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  dispatch(setAnalytics(mockAnalytics));
  dispatch(setLoading(false));
};

export const {
  setLoading,
  setError,
  setUsers,
  updateUser,
  deleteUser,
  setVerificationRequests,
  updateVerificationRequest,
  setAnalytics,
} = adminSlice.actions;

// Selectors
export const selectUsers = (state) => state.admin.users;
export const selectVerificationRequests = (state) => state.admin.verificationRequests;
export const selectAnalytics = (state) => state.admin.analytics;
export const selectAdminLoading = (state) => state.admin.loading;

export default adminSlice.reducer;
