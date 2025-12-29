import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ... (Async Thunks)

// ... (Slice)

// Selectors
export const selectCampaigns = (state) => state.campaigns.campaigns;
export const selectSelectedCampaign = (state) => state.campaigns.selectedCampaign;
export const selectCampaignsLoading = (state) => state.campaigns.loading;
export const selectCampaignsError = (state) => state.campaigns.error;
export const selectCampaignsPagination = (state) => state.campaigns.pagination;
export const selectCampaignsFilters = (state) => state.campaigns.filters;

// Filtered campaigns selector (Client-side fallback)
export const selectFilteredCampaigns = createSelector(
  [selectCampaigns, selectCampaignsFilters],
  (campaigns, filters) => {
    const { status, isEmergency, search } = filters;

    return campaigns.filter((campaign) => {
      const matchesStatus = status === 'all' || campaign.status === status;
      const matchesEmergency = isEmergency === 'all' || 
        (isEmergency === 'true' ? campaign.isEmergency : !campaign.isEmergency);
      const matchesSearch = !search || 
        campaign.title.toLowerCase().includes(search.toLowerCase()) ||
        campaign.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesEmergency && matchesSearch;
    });
  }
);

// Async Thunks
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/campaigns', { params });
      return response; // Assuming backend returns { data, total } or array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData, { rejectWithValue }) => {
    try {
      // Need to handle FormData for file upload if image is present
      // Currently assuming JSON for simplicity, but if image is needed, use FormData
      // Controller uses @UseInterceptors(FileInterceptor('image'))
      // So checks if campaignData is FormData
      
      const response = await api.post('/campaigns', campaignData, {
        headers: {
            'Content-Type': campaignData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create campaign');
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/campaigns/${id}`, data);
      return response;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to update campaign');
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/campaigns/${id}`);
      return id;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to delete campaign');
    }
  }
);

export const updateCampaignStatus = createAsyncThunk(
  'campaigns/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/campaigns/${id}/status`, { status });
        return { id, status, data: response };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const publishCampaign = createAsyncThunk(
  'campaigns/publish',
  async (id, { dispatch }) => dispatch(updateCampaignStatus({ id, status: 'ACTIVE' }))
);

export const pauseCampaign = createAsyncThunk(
  'campaigns/pause',
  async (id, { dispatch }) => dispatch(updateCampaignStatus({ id, status: 'PAUSED' }))
);

export const completeCampaign = createAsyncThunk(
  'campaigns/complete',
  async (id, { dispatch }) => dispatch(updateCampaignStatus({ id, status: 'COMPLETED' }))
);

export const cancelCampaign = createAsyncThunk(
  'campaigns/cancel',
  async (id, { dispatch }) => dispatch(updateCampaignStatus({ id, status: 'CANCELLED' }))
);

const initialState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
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
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
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
        .addCase(fetchCampaigns.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCampaigns.fulfilled, (state, action) => {
            state.loading = false;
             if (Array.isArray(action.payload)) {
                state.campaigns = action.payload;
                state.pagination.total = action.payload.length;
            } else {
                state.campaigns = action.payload.data || [];
                state.pagination.total = action.payload.total || 0;
            }
        })
        .addCase(fetchCampaigns.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Create
    builder.addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns.unshift(action.payload);
        state.pagination.total += 1;
    });

    // Update & Update Status
    builder
        .addCase(updateCampaign.fulfilled, (state, action) => {
            const index = state.campaigns.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.campaigns[index] = action.payload;
            }
            if (state.selectedCampaign?.id === action.payload.id) {
                state.selectedCampaign = action.payload;
            }
        })
        .addCase(updateCampaignStatus.fulfilled, (state, action) => {
             const index = state.campaigns.findIndex(c => c.id === action.payload.id);
             if (index !== -1) {
                 state.campaigns[index].status = action.payload.status;
             }
             if (state.selectedCampaign?.id === action.payload.id) {
                 state.selectedCampaign.status = action.payload.status;
             }
        });

    // Delete
    builder.addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
        state.pagination.total -= 1;
         if (state.selectedCampaign?.id === action.payload) {
            state.selectedCampaign = null;
        }
    });
  }
});

export const {
  setSelectedCampaign,
  setPagination,
  setFilters,
  resetFilters,
  clearError
} = campaignsSlice.actions;

// Selectors


export const selectActiveCampaignsCount = (state) => {
  return state.campaigns.campaigns.filter((c) => c.status === 'ACTIVE').length;
};

export default campaignsSlice.reducer;
