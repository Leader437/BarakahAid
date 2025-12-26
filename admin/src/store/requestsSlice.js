// Requests Slice - Donation requests management with mock data
import { createSlice } from '@reduxjs/toolkit';
import { mockRequests } from '../../../client/src/utils/dummyData';

const initialState = {
  requests: mockRequests, // Populated with mock data
  selectedRequest: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: mockRequests.length,
  },
  filters: {
    status: 'all',
    category: 'all',
    urgency: 'all',
    search: '',
  },
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
      state.pagination.total = action.payload.length;
    },
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    updateRequest: (state, action) => {
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = { ...state.requests[index], ...action.payload };
      }
      if (state.selectedRequest?.id === action.payload.id) {
        state.selectedRequest = { ...state.selectedRequest, ...action.payload };
      }
    },
    deleteRequest: (state, action) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload);
      state.pagination.total -= 1;
    },
    approveRequest: (state, action) => {
      const index = state.requests.findIndex((r) => r.id === action.payload);
      if (index !== -1) {
        state.requests[index].status = 'APPROVED';
      }
      if (state.selectedRequest?.id === action.payload) {
        state.selectedRequest.status = 'APPROVED';
      }
    },
    rejectRequest: (state, action) => {
      const index = state.requests.findIndex((r) => r.id === action.payload);
      if (index !== -1) {
        state.requests[index].status = 'REJECTED';
      }
      if (state.selectedRequest?.id === action.payload) {
        state.selectedRequest.status = 'REJECTED';
      }
    },
    markFulfilled: (state, action) => {
      const index = state.requests.findIndex((r) => r.id === action.payload);
      if (index !== -1) {
        state.requests[index].status = 'FULFILLED';
      }
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
  },
});

export const {
  setLoading,
  setError,
  setRequests,
  setSelectedRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
  markFulfilled,
  setPagination,
  setFilters,
  resetFilters,
} = requestsSlice.actions;

// Selectors
export const selectRequests = (state) => state.requests.requests;
export const selectSelectedRequest = (state) => state.requests.selectedRequest;
export const selectRequestsLoading = (state) => state.requests.loading;
export const selectRequestsError = (state) => state.requests.error;
export const selectRequestsPagination = (state) => state.requests.pagination;
export const selectRequestsFilters = (state) => state.requests.filters;

// Filtered requests selector
export const selectFilteredRequests = (state) => {
  const { requests } = state.requests;
  const { status, category, urgency, search } = state.requests.filters;

  return requests.filter((request) => {
    const matchesStatus = status === 'all' || request.status === status;
    const matchesCategory = category === 'all' || request.category === category;
    const matchesUrgency = urgency === 'all' || request.urgency === urgency;
    const matchesSearch = !search || 
      request.title.toLowerCase().includes(search.toLowerCase()) ||
      request.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });
};

// Pending requests count selector
export const selectPendingRequestsCount = (state) => {
  return state.requests.requests.filter((r) => r.status === 'PENDING').length;
};

export default requestsSlice.reducer;
