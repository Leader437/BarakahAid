// User Slice - Authentication and user management
import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../utils/dummyData';

const initialState = {
  user: null,
  isAuthenticated: false,
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
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Mock async thunks (simulating API calls)
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock login logic
  const user = mockUsers.find(
    (u) => u.email === credentials.email
  );
  
  if (user) {
    dispatch(loginSuccess(user));
    return { success: true, user };
  } else {
    dispatch(loginFailure('Invalid email or password'));
    return { success: false, error: 'Invalid email or password' };
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerStart());
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock registration logic
  const newUser = {
    id: `user-${Date.now()}`,
    ...userData,
    verified: false,
    joinedDate: new Date().toISOString(),
  };
  
  dispatch(registerSuccess(newUser));
  return { success: true, user: newUser };
};

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

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
