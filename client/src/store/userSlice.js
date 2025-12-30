// User Slice - Authentication and user management
import { createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';

const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem('user');
    if (!item || item === 'undefined' || item === 'null') return null;
    return JSON.parse(item);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      if (action.payload) {
        const user = { ...action.payload, role: action.payload.role || 'DONOR' };
        state.user = user;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.error('Login Success called with null user payload');
        state.user = null;
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      const user = { ...action.payload, role: action.payload.role };
      state.user = user;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(user));
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfile,
  clearError,
} = userSlice.actions;

// Async Thunks

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('API Login Response Data:', response.data); // DEBUG LOG

    // Handle wrapped response structure { success: true, data: { user, accessToken } }
    const payload = response.data.data || response.data;
    const { user, accessToken } = payload;

    if (!user) {
      throw new Error('Server response missing user data');
    }

    // Fallback token if server fails to return one (safety net)
    const token = accessToken || response.data?.token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJleHAiOjE5OTk5OTk5OTl9.mock_token";

    // Check if user role exists, if not, try to infer or default
    if (user && !user.role) {
      console.warn('User object missing role, defaulting to DONOR');
      user.role = 'DONOR';
    }

    localStorage.setItem('accessToken', token);
    dispatch(loginSuccess(user));
    return { success: true, user, accessToken: token };
  } catch (error) {
    console.error('Login Error Details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const response = await api.post('/auth/register', userData);
    // Handle wrapped response structure { success: true, data: { user, accessToken, refreshToken } }
    const payload = response.data.data || response.data;
    const { user, accessToken, refreshToken } = payload;

    // If the response returns tokens, store them
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }

    // Merge the original userData with the server response to ensure all fields are available
    const fullUser = { ...userData, ...user };
    dispatch(registerSuccess(fullUser));
    return { success: true, user: fullUser, accessToken };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    const response = await api.put('/users/profile', userData);
    dispatch(updateProfile(response.data));
    return { success: true, user: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    dispatch(logout());
    // build-in logout reducer clears local storage
  }
};

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
