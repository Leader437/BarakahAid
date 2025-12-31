import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ... (Async Thunks remain same)

// ... (Slice remains same)

// Selectors
export const selectRequests = (state) => state.requests.requests;
export const selectSelectedRequest = (state) => state.requests.selectedRequest;
export const selectRequestsLoading = (state) => state.requests.loading;
export const selectRequestsError = (state) => state.requests.error;
export const selectRequestsPagination = (state) => state.requests.pagination;
export const selectRequestsFilters = (state) => state.requests.filters;

// Filtered fallback
export const selectFilteredRequests = createSelector(
  [selectRequests, selectRequestsFilters],
  (requests, filters) => {
    const { status, category, urgency, search } = filters;

    return requests.filter((request) => {
      const matchesStatus = status === 'all' || request.status === status;
      const matchesCategory = category === 'all' || request.category === category;
      const matchesUrgency = urgency === 'all' || request.urgency === urgency;
      const matchesSearch = !search ||
        request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
);

// Async Thunks
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (params, { rejectWithValue }) => {
    try {
      // Admin panel needs to see all statuses for approval workflow
      const response = await api.get('/donation-requests', {
        params: { includeAll: true, ...params }
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // Using PUT /donation-requests/:id
      // We might need to pass the full object or just status.
      // Controller: update(@Body() updateDto)
      // We should check what updateDto expects. Assuming partial update is allowed or we are careful.
      // For status update, we usually send { status }.
      const response = await api.put(`/donation-requests/${id}`, { status });
      return { id, status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update request status');
    }
  }
);

// Approve Request
export const approveRequest = createAsyncThunk(
  'requests/approve',
  async (id, { dispatch }) => dispatch(updateRequestStatus({ id, status: 'APPROVED' }))
);

// Reject Request
export const rejectRequest = createAsyncThunk(
  'requests/reject',
  async (id, { dispatch }) => dispatch(updateRequestStatus({ id, status: 'REJECTED' }))
);

// Mark Fulfilled
export const markFulfilled = createAsyncThunk(
  'requests/fulfill',
  async (id, { dispatch }) => dispatch(updateRequestStatus({ id, status: 'FULFILLED' }))
);

export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/donation-requests/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete request');
    }
  }
);

const initialState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
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
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
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
    // Fetch
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        let data = [];
        if (Array.isArray(action.payload)) {
          data = action.payload;
          state.pagination.total = action.payload.length;
        } else {
          data = action.payload.data || [];
          state.pagination.total = action.payload.total || 0;
        }
        state.requests = data;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Status
    builder.addCase(updateRequestStatus.fulfilled, (state, action) => {
      const index = state.requests.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index].status = action.payload.status;
      }
      if (state.selectedRequest?.id === action.payload.id) {
        state.selectedRequest.status = action.payload.status;
      }
    });

    // Delete
    builder.addCase(deleteRequest.fulfilled, (state, action) => {
      state.requests = state.requests.filter(r => r.id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedRequest?.id === action.payload) {
        state.selectedRequest = null;
      }
    });
  }
});

export const {
  setSelectedRequest,
  setPagination,
  setFilters,
  resetFilters,
  clearError
} = requestsSlice.actions;

// Selectors


// Pending requests count selector
export const selectPendingRequestsCount = (state) => {
  return state.requests.requests.filter((r) => r.status === 'PENDING').length;
};

export default requestsSlice.reducer;
