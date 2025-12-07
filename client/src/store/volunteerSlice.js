// Volunteer Slice - Volunteer events and tasks
import { createSlice } from '@reduxjs/toolkit';
import { mockVolunteerEvents } from '../utils/dummyData';

const initialState = {
  events: [...mockVolunteerEvents],
  myEvents: [],
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setMyEvents: (state, action) => {
      state.myEvents = action.payload;
    },
    registerForEvent: (state, action) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.volunteersRegistered += 1;
        state.myEvents.push(event);
      }
    },
    unregisterFromEvent: (state, action) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.volunteersRegistered -= 1;
      }
      state.myEvents = state.myEvents.filter((e) => e.id !== action.payload);
    },
  },
});

// Mock async actions
export const fetchEvents = (filters = {}) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filtered = [...mockVolunteerEvents];
  
  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }
  if (filters.status) {
    filtered = filtered.filter((e) => e.status === filters.status);
  }
  
  dispatch(setEvents(filtered));
  dispatch(setLoading(false));
};

export const fetchMyEvents = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Mock: return events the user is registered for
  const userEvents = mockVolunteerEvents.slice(0, 2);
  dispatch(setMyEvents(userEvents));
  dispatch(setLoading(false));
};

export const registerForEventAsync = (eventId) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  dispatch(registerForEvent(eventId));
  dispatch(setLoading(false));
  return { success: true };
};

export const {
  setLoading,
  setError,
  setEvents,
  setMyEvents,
  registerForEvent,
  unregisterFromEvent,
} = volunteerSlice.actions;

// Selectors
export const selectEvents = (state) => state.volunteer.events;
export const selectMyEvents = (state) => state.volunteer.myEvents;
export const selectVolunteerLoading = (state) => state.volunteer.loading;

export default volunteerSlice.reducer;
