// NGO Slice - NGO and campaign management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  campaigns: [],
  myCampaigns: [],
  donations: [], // received donations
  requests: [], // [NEW] my requests
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCampaigns = createAsyncThunk(
  'ngo/fetchCampaigns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/campaigns', { params });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

export const fetchMyCampaigns = createAsyncThunk(
  'ngo/fetchMyCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/campaigns/my-campaigns');
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my campaigns');
    }
  }
);

export const fetchNgoDonations = createAsyncThunk(
  'ngo/fetchNgoDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions/received');
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch received donations');
    }
  }
);

export const fetchMyRequests = createAsyncThunk(
  'ngo/fetchMyRequests',
  async (_, { rejectWithValue }) => {
    try {
      // Endpoint from DonationsController: @Get('my-requests')
      const response = await api.get('/donation-requests/my-requests');
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my requests');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'ngo/createCampaign',
  async (campaignData, { rejectWithValue }) => {
    try {
      const response = await api.post('/campaigns', campaignData, {
        headers: {
             'Content-Type': campaignData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create campaign');
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'ngo/updateCampaign',
  async ({ id, data }, { rejectWithValue }) => {
      try {
          const response = await api.put(`/campaigns/${id}`, data);
          return response.data || response;
      } catch (error) {
          return rejectWithValue(error.response?.data?.message || 'Failed to update campaign');
      }
  }
);

export const deleteCampaign = createAsyncThunk(
    'ngo/deleteCampaign',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/campaigns/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete campaign');
        }
    }
);


const ngoSlice = createSlice({
  name: 'ngo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Campaigns
    builder
        .addCase(fetchCampaigns.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCampaigns.fulfilled, (state, action) => {
            state.loading = false;
            state.campaigns = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        })
        .addCase(fetchCampaigns.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Fetch My Campaigns
    builder
        .addCase(fetchMyCampaigns.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMyCampaigns.fulfilled, (state, action) => {
            state.loading = false;
            state.myCampaigns = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        })
        .addCase(fetchMyCampaigns.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Fetch NGO Donations
    builder
        .addCase(fetchNgoDonations.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchNgoDonations.fulfilled, (state, action) => {
            state.loading = false;
            state.donations = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        })
        .addCase(fetchNgoDonations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Fetch My Requests
    builder
        .addCase(fetchMyRequests.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMyRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.requests = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        })
        .addCase(fetchMyRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Create Campaign
    builder
        .addCase(createCampaign.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCampaign.fulfilled, (state, action) => {
            state.loading = false;
            // Add to lists
            state.campaigns.unshift(action.payload);
            state.myCampaigns.unshift(action.payload);
        })
        .addCase(createCampaign.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    
    // Update Campaign
    builder.addCase(updateCampaign.fulfilled, (state, action) => {
         const index = state.campaigns.findIndex(c => c.id === action.payload.id);
         if (index !== -1) state.campaigns[index] = action.payload;
         const myIndex = state.myCampaigns.findIndex(c => c.id === action.payload.id);
         if (myIndex !== -1) state.myCampaigns[myIndex] = action.payload;
    });

    // Delete Campaign
    builder.addCase(deleteCampaign.fulfilled, (state, action) => {
         state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
         state.myCampaigns = state.myCampaigns.filter(c => c.id !== action.payload);
    });
  }
});

export const {
  clearError
} = ngoSlice.actions;

// Selectors
export const selectCampaigns = (state) => state.ngo.campaigns;
export const selectMyCampaigns = (state) => state.ngo.myCampaigns;
export const selectNgoDonations = (state) => state.ngo.donations;
export const selectNgoRequests = (state) => state.ngo.requests;
export const selectNgoLoading = (state) => state.ngo.loading;
export const selectNgoError = (state) => state.ngo.error;

export default ngoSlice.reducer;


