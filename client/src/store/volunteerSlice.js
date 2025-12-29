// Volunteer Slice - Volunteer events and tasks
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'volunteer/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Backend might support query params.
      // Controller: findAllEvents() does NOT take arguments in the snippet I saw (Step 135).
      // But service might? "return this.volunteersService.findAllEvents();"
      // Assuming it returns all events.
      const response = await api.get('/volunteers/events');
      
      let data = response.data || response;
      if (data.data && Array.isArray(data.data)) {
          data = data.data;
      } else if (!Array.isArray(data)) {
          data = []; // Fallback to empty array if response format is unexpected
      }
      // Client-side filtering if backend doesn't support it yet
      if (filters.category && filters.category !== 'all') {
          data = data.filter(e => e.category === filters.category);
      }
      if (filters.status && filters.status !== 'all') {
          data = data.filter(e => e.status === filters.status);
      }
      return data;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchVolunteerProfile = createAsyncThunk(
  'volunteer/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/volunteers/profile');
      let data = response.data || response;
      if (data.data) {
          data = data.data; // Unwrap if wrapped
      }
      return data;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const registerForEventAsync = createAsyncThunk(
  'volunteer/registerForEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/volunteers/events/${eventId}/signup`);
      return { eventId, data: response.data };
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to register for event');
    }
  }
);

const initialState = {
  events: [],
  myEvents: [], // or derived from profile
  profile: null,
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
        .addCase(fetchEvents.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.events = action.payload;
        })
        .addCase(fetchEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    // Fetch Profile (My Events)
    builder
        .addCase(fetchVolunteerProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchVolunteerProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            // Assuming profile has 'participatedEvents' or similar
            if (action.payload.participatedEvents) {
                state.myEvents = action.payload.participatedEvents;
            }
        })
        .addCase(fetchVolunteerProfile.rejected, (state, action) => {
            state.loading = false;
            // Don't set global error for profile fetch if it's 404 (user not a volunteer yet)
            if (action.payload !== 'Not Found') {
               state.error = action.payload;
            }
        });

    // Register
    builder
        .addCase(registerForEventAsync.fulfilled, (state, action) => {
             // Update event in list
             const event = state.events.find(e => e.id === action.payload.eventId);
             if (event) {
                 // Update locally or refetch
                 event.volunteersRegistered = (event.volunteersRegistered || 0) + 1;
                 state.myEvents.push(event); // Add to my events temporarily
             }
        })
        .addCase(registerForEventAsync.rejected, (state, action) => {
            state.error = action.payload;
        });
  }
});

export const {
  clearError
} = volunteerSlice.actions;

// Selectors
export const selectEvents = (state) => state.volunteer.events;
export const selectMyEvents = (state) => state.volunteer.myEvents;
export const selectVolunteerProfile = (state) => state.volunteer.profile;
export const selectVolunteerLoading = (state) => state.volunteer.loading;
export const selectVolunteerError = (state) => state.volunteer.error;

export default volunteerSlice.reducer;
