// NGO Slice - NGO and campaign management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  campaigns: [],
  myCampaigns: [],
  donations: [],
  requests: [],
  events: [],
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

export const deleteRequest = createAsyncThunk(
  'ngo/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/donation-requests/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete request');
    }
  }
);

// Event Thunks
export const fetchMyEvents = createAsyncThunk(
  'ngo/fetchMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/volunteers/events/my-events');
      const result = response.data || response;
      return result.data || result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'ngo/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const isFormData = eventData instanceof FormData;
      const response = await api.post('/volunteers/events', eventData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      const result = response.data || response;
      return result.data || result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'ngo/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.put(`/volunteers/events/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      const result = response.data || response;
      return result.data || result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'ngo/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/volunteers/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
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

    // Delete Request
    builder.addCase(deleteRequest.fulfilled, (state, action) => {
      state.requests = state.requests.filter(r => r.id !== action.payload);
    });

    // Fetch My Events
    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Event
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.events.unshift(action.payload);
    });

    // Update Event
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state.events[index] = action.payload;
    });

    // Delete Event
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    });
  }
});

export const { clearError } = ngoSlice.actions;

// Selectors
export const selectCampaigns = (state) => state.ngo.campaigns;
export const selectMyCampaigns = (state) => state.ngo.myCampaigns;
export const selectNgoDonations = (state) => state.ngo.donations;
export const selectNgoRequests = (state) => state.ngo.requests;
export const selectNgoEvents = (state) => state.ngo.events;
export const selectNgoLoading = (state) => state.ngo.loading;
export const selectNgoError = (state) => state.ngo.error;

export default ngoSlice.reducer;
