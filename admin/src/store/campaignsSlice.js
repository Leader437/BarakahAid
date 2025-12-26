// Campaigns Slice - Campaign management with mock data
import { createSlice } from '@reduxjs/toolkit';
import { mockCampaigns } from '../../../client/src/utils/dummyData';

const initialState = {
  campaigns: mockCampaigns, // Populated with mock data
  selectedCampaign: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: mockCampaigns.length,
  },
  filters: {
    status: 'all',
    isEmergency: 'all',
    search: '',
  },
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
      state.pagination.total = action.payload.length;
    },
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    addCampaign: (state, action) => {
      state.campaigns.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = { ...state.campaigns[index], ...action.payload };
      }
      if (state.selectedCampaign?.id === action.payload.id) {
        state.selectedCampaign = { ...state.selectedCampaign, ...action.payload };
      }
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      state.pagination.total -= 1;
    },
    publishCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload);
      if (index !== -1) {
        state.campaigns[index].status = 'ACTIVE';
      }
    },
    pauseCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload);
      if (index !== -1) {
        state.campaigns[index].status = 'PAUSED';
      }
    },
    completeCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload);
      if (index !== -1) {
        state.campaigns[index].status = 'COMPLETED';
      }
    },
    cancelCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload);
      if (index !== -1) {
        state.campaigns[index].status = 'CANCELLED';
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
  setCampaigns,
  setSelectedCampaign,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  pauseCampaign,
  completeCampaign,
  cancelCampaign,
  setPagination,
  setFilters,
  resetFilters,
} = campaignsSlice.actions;

// Selectors
export const selectCampaigns = (state) => state.campaigns.campaigns;
export const selectSelectedCampaign = (state) => state.campaigns.selectedCampaign;
export const selectCampaignsLoading = (state) => state.campaigns.loading;
export const selectCampaignsError = (state) => state.campaigns.error;
export const selectCampaignsPagination = (state) => state.campaigns.pagination;
export const selectCampaignsFilters = (state) => state.campaigns.filters;

// Filtered campaigns selector
export const selectFilteredCampaigns = (state) => {
  const { campaigns } = state.campaigns;
  const { status, isEmergency, search } = state.campaigns.filters;

  return campaigns.filter((campaign) => {
    const matchesStatus = status === 'all' || campaign.status === status;
    const matchesEmergency = isEmergency === 'all' || 
      (isEmergency === 'true' ? campaign.isEmergency : !campaign.isEmergency);
    const matchesSearch = !search || 
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesEmergency && matchesSearch;
  });
};

// Active campaigns count selector
export const selectActiveCampaignsCount = (state) => {
  return state.campaigns.campaigns.filter((c) => c.status === 'ACTIVE').length;
};

export default campaignsSlice.reducer;
