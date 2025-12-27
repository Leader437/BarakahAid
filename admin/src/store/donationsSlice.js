// Donations Slice - Donation tracking state with mock data
import { createSlice } from '@reduxjs/toolkit';
import { mockDonations } from '../../../client/src/utils/dummyData';

// Calculate stats from mock data
const calculateStats = (donations) => {
  const completed = donations.filter((d) => d.status === 'COMPLETED');
  const pending = donations.filter((d) => d.status === 'PENDING');
  const totalAmount = completed.reduce((sum, d) => sum + d.amount, 0);

  return {
    total: donations.length,
    completed: completed.length,
    pending: pending.length,
    totalAmount,
  };
};

const initialState = {
  donations: mockDonations, // Populated with mock data
  selectedDonation: null,
  loading: false,
  error: null,
  stats: calculateStats(mockDonations),
  pagination: {
    page: 1,
    limit: 10,
    total: mockDonations.length,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDonations: (state, action) => {
      state.donations = action.payload;
      state.stats = calculateStats(action.payload);
      state.pagination.total = action.payload.length;
    },
    setSelectedDonation: (state, action) => {
      state.selectedDonation = action.payload;
    },
    updateDonation: (state, action) => {
      const index = state.donations.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.donations[index] = { ...state.donations[index], ...action.payload };
        state.stats = calculateStats(state.donations);
      }
    },
    refundDonation: (state, action) => {
      const index = state.donations.findIndex((d) => d.id === action.payload);
      if (index !== -1) {
        state.donations[index].status = 'REFUNDED';
        state.stats = calculateStats(state.donations);
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
  setDonations,
  setSelectedDonation,
  updateDonation,
  refundDonation,
  setPagination,
  setFilters,
  resetFilters,
} = donationsSlice.actions;

// Selectors
export const selectDonations = (state) => state.donations.donations;
export const selectSelectedDonation = (state) => state.donations.selectedDonation;
export const selectDonationsLoading = (state) => state.donations.loading;
export const selectDonationsError = (state) => state.donations.error;
export const selectDonationsStats = (state) => state.donations.stats;
export const selectDonationsPagination = (state) => state.donations.pagination;
export const selectDonationsFilters = (state) => state.donations.filters;

// Filtered donations selector
export const selectFilteredDonations = (state) => {
  const { donations } = state.donations;
  const { status, search } = state.donations.filters;

  return donations.filter((donation) => {
    const matchesStatus = status === 'all' || donation.status === status;
    const matchesSearch = !search || 
      donation.donor.name.toLowerCase().includes(search.toLowerCase()) ||
      donation.campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      donation.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};

export default donationsSlice.reducer;
