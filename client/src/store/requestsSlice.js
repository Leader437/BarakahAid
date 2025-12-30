// Requests Slice - Donation requests management (REAL API)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    urgency: '',
    status: 'active',
    searchQuery: '',
  },
};

// Async Thunks
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.search || filters.searchQuery) params.append('search', filters.search || filters.searchQuery);

      const response = await api.get(`/donation-requests?${params.toString()}`);
      let data = response.data;
      if (data.data) data = data.data; // Unwrap if nested
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  'requests/fetchRequestById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/donation-requests/${id}`);
      let data = response.data;
      if (data.data) data = data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch request');
    }
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const isFormData = requestData instanceof FormData;
      const response = await api.post('/donation-requests', requestData, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
        }
      });
      let data = response.data;
      if (data.data) data = data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create request');
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRequests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend entity to frontend model with graceful fallbacks
        state.requests = action.payload.map(req => ({
          id: req.id,
          title: req.title,
          description: req.description,
          category: req.category?.name || 'General',
          categoryId: req.category?.id,
          // These fields may not exist in backend - provide fallbacks
          targetAmount: Number(req.targetAmount) || 0,
          currentAmount: Number(req.currentAmount) || 0,
          status: req.status?.toLowerCase() || 'pending',
          urgency: req.urgency || 'medium',
          createdBy: req.createdBy?.id,
          createdByName: req.createdBy?.name || 'Anonymous',
          media: req.media || [],
          location: req.location?.address || req.location || null,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
          // Calculate daysLeft if deadline exists, else default
          daysLeft: req.deadline ? Math.max(0, Math.ceil((new Date(req.deadline) - new Date()) / 86400000)) : 30,
          beneficiaries: req.beneficiaries || 0
        }));
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchRequestById
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        const req = action.payload;
        state.currentRequest = {
          id: req.id,
          title: req.title,
          description: req.description,
          category: req.category?.name || 'General',
          categoryId: req.category?.id,
          targetAmount: Number(req.targetAmount) || 0,
          currentAmount: Number(req.currentAmount) || 0,
          status: req.status?.toLowerCase() || 'active',
          urgency: req.urgency || 'normal',
          createdBy: req.createdBy?.id,
          createdByName: req.createdBy?.name || 'Anonymous',
          media: req.media || [],
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
        };
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createRequest
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentRequest,
  clearError,
} = requestsSlice.actions;

// Selectors
export const selectAllRequests = (state) => state.requests.requests;
export const selectCurrentRequest = (state) => state.requests.currentRequest;
export const selectRequestsLoading = (state) => state.requests.loading;
export const selectRequestsError = (state) => state.requests.error;
export const selectFilters = (state) => state.requests.filters;

export default requestsSlice.reducer;
