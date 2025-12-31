import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ... (Async Thunks)

// ... (Slice)

// Selectors
export const selectDonations = (state) => state.donations.donations;
export const selectSelectedDonation = (state) => state.donations.selectedDonation;
export const selectDonationsLoading = (state) => state.donations.loading;
export const selectDonationsError = (state) => state.donations.error;
export const selectDonationsStats = (state) => state.donations.stats;
export const selectDonationsPagination = (state) => state.donations.pagination;
export const selectDonationsFilters = (state) => state.donations.filters;

// Filtered fallback
export const selectFilteredDonations = createSelector(
  [selectDonations, selectDonationsFilters],
  (donations, filters) => {
    const { status, search } = filters;

    return donations.filter((donation) => {
      const matchesStatus = status === 'all' || donation.status === status;
      // Check fields for safety
      const donorName = donation.donor?.name || donation.donorName || '';
      const campaignTitle = donation.campaign?.title || donation.campaignTitle || '';
      const txId = donation.transactionId || '';

      const matchesSearch = !search ||
        donorName.toLowerCase().includes(search.toLowerCase()) ||
        campaignTitle.toLowerCase().includes(search.toLowerCase()) ||
        txId.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }
);

// Async Thunks
export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions', { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch donations');
    }
  }
);

export const updateDonationStatus = createAsyncThunk(
  'donations/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/transactions/${id}/status`, { status });
      return { id, status, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update donation');
    }
  }
);

export const updateDonation = createAsyncThunk(
  'donations/update',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    // Alias for updateDonationStatus for now
    return dispatch(updateDonationStatus({ id, status }));
  }
);

export const refundDonation = createAsyncThunk(
  'donations/refund',
  async (id, { rejectWithValue }) => {
    try {
      // Assuming backend has a refund endpoint or we just set status
      // Based on previous analysis: POST /donations/:id/refund might not exist, 
      // but let's try PUT status 'REFUNDED'
      const response = await api.put(`/transactions/${id}/status`, { status: 'REFUNDED' });
      return { id, status: 'REFUNDED', data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refund donation');
    }
  }
);

// Calculate stats helper
const calculateStats = (donations) => {
  if (!Array.isArray(donations)) return { total: 0, completed: 0, pending: 0, totalAmount: 0 };

  const completed = donations.filter((d) => d.status === 'COMPLETED');
  const pending = donations.filter((d) => d.status === 'PENDING');
  const totalAmount = completed.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return {
    total: donations.length,
    completed: completed.length,
    pending: pending.length,
    totalAmount,
  };
};

const initialState = {
  donations: [],
  selectedDonation: null,
  loading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    status: 'all',
    dateRange: 'all',
    search: '',
  },
};

const donationsSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    setSelectedDonation: (state, action) => {
      state.selectedDonation = action.payload;
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
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        let data = [];
        if (Array.isArray(action.payload)) {
          data = action.payload;
          state.pagination.total = action.payload.length;
        } else {
          data = action.payload.data || [];
          state.pagination.total = action.payload.total || 0;
        }
        state.donations = data;
        state.stats = calculateStats(data);
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Status
    // Update Status & Refund
    builder
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        const index = state.donations.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.donations[index].status = action.payload.status;
          state.stats = calculateStats(state.donations);
        }
        if (state.selectedDonation?.id === action.payload.id) {
          state.selectedDonation.status = action.payload.status;
        }
      })
      .addCase(refundDonation.fulfilled, (state, action) => {
        const index = state.donations.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.donations[index].status = 'REFUNDED';
          state.stats = calculateStats(state.donations);
        }
        if (state.selectedDonation?.id === action.payload.id) {
          state.selectedDonation.status = 'REFUNDED';
        }
      });
  }
});

export const {
  setSelectedDonation,
  setPagination,
  setFilters,
  resetFilters,
  clearError
} = donationsSlice.actions;

// Selectors


export default donationsSlice.reducer;
