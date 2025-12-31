import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ... (Async Thunks)

// ... (Slice)

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersFilters = (state) => state.users.filters;

// Filtered users selector (Client-side filtering fallback if API returns all)
export const selectFilteredUsers = createSelector(
  [selectUsers, selectUsersFilters],
  (users, filters) => {
    const { role, status, search } = filters;

    // Assuming API currently fetches ALL users (based on GetAllUsers), we filter locally for now.
    // If API supports filtering, we should rely on that and remove this selector or make it pass-through.

    return users.filter((user) => {
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || user.verificationStatus === status;
      // Check fields carefully, might vary.
      const nameMatch = user.name?.toLowerCase().includes(search.toLowerCase());
      const emailMatch = user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesSearch = !search || nameMatch || emailMatch;

      return matchesRole && matchesStatus && matchesSearch;
    });
  }
);

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/users', { params });
      // Expecting response to vary based on backend. 
      // If backend returns array: { data: response, total: response.length }
      // If backend handles pagination, it returns { data, total, ... }
      // Based on controller, getAllUsers returns this.usersService.findAll().
      // I should assume it returns an array for now as per simple service pattern usually unless paginated.
      // Let's assume array for now, or check service later.
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'users/verifyUser',
  async (userId, { rejectWithValue }) => {
    try {
      // Backend expects PUT /users/:id/verification with { status: 'VERIFIED' }
      const response = await api.put(`/users/${userId}/verification`, { status: 'VERIFIED' });
      const result = response.data || response;
      return { id: userId, status: 'VERIFIED', user: result.data || result };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify user');
    }
  }
);


export const rejectUser = createAsyncThunk(
  'users/rejectUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}/verification`, { status: 'REJECTED' });
      const result = response.data || response;
      return { id: userId, status: 'REJECTED', user: result.data || result };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject user');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, status, isBlocked }, { rejectWithValue }) => {
    try {
      // Using Admin Controller endpoint: PATCH /admin/users/:id/status
      // It expects UpdateUserStatusDto.
      // If we are toggling block, we might send { isBlocked: true/false } or status 'BLOCKED'.
      // Looking at UsersList.jsx, it passes { id, isBlocked }.
      // Let's assume the backend supports { isBlocked } or generic status.
      // AdminController uses adminService.updateUserStatus(id, dto).
      const payload = {};
      if (status) payload.status = status;
      if (isBlocked !== undefined) payload.isBlocked = isBlocked;

      const response = await api.patch(`/admin/users/${id}/status`, payload);
      return { id, ...payload, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    role: 'all',
    status: 'all',
    search: '',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // If payload is array
        if (Array.isArray(action.payload)) {
          state.users = action.payload;
          state.pagination.total = action.payload.length;
        } else {
          // Assume paginated structure
          state.users = action.payload.data || [];
          state.pagination.total = action.payload.total || 0;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      });

    // Verify/Reject User
    builder
      .addCase(verifyUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index].verificationStatus = action.payload.status;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.verificationStatus = action.payload.status;
        }
      })
      .addCase(rejectUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index].verificationStatus = action.payload.status;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.verificationStatus = action.payload.status;
        }
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status, isBlocked, isSuspended } = action.payload;
        const index = state.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          if (status) state.users[index].status = status;
          if (isBlocked !== undefined) state.users[index].isBlocked = isBlocked;
          if (isSuspended !== undefined) state.users[index].isSuspended = isSuspended;
        }
        if (state.selectedUser?.id === id) {
          if (status) state.selectedUser.status = status;
          if (isBlocked !== undefined) state.selectedUser.isBlocked = isBlocked;
          if (isSuspended !== undefined) state.selectedUser.isSuspended = isSuspended;
        }
      });
  },
});

export const {
  setSelectedUser,
  setPagination,
  setFilters,
  resetFilters,
  clearError
} = usersSlice.actions;

// Selectors


export default usersSlice.reducer;
