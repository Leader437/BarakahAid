// Users Slice - User management state with mock data
import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../../client/src/utils/dummyData';

const initialState = {
  users: mockUsers, // Populated with mock data
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: mockUsers.length,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.pagination.total = action.payload.length;
    },
    addUser: (state, action) => {
      state.users.unshift(action.payload);
      state.pagination.total += 1;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = { ...state.selectedUser, ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },
    verifyUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload);
      if (index !== -1) {
        state.users[index].verificationStatus = 'VERIFIED';
      }
    },
    rejectUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload);
      if (index !== -1) {
        state.users[index].verificationStatus = 'REJECTED';
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
  },
});

export const {
  setLoading,
  setError,
  setUsers,
  addUser,
  setSelectedUser,
  updateUser,
  deleteUser,
  verifyUser,
  rejectUser,
  setPagination,
  setFilters,
  resetFilters,
} = usersSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersFilters = (state) => state.users.filters;

// Filtered users selector
export const selectFilteredUsers = (state) => {
  const { users } = state.users;
  const { role, status, search } = state.users.filters;

  return users.filter((user) => {
    const matchesRole = role === 'all' || user.role === role;
    const matchesStatus = status === 'all' || user.verificationStatus === status;
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });
};

export default usersSlice.reducer;
