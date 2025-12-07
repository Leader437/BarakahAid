// Requests Slice - Donation requests management
import { createSlice } from '@reduxjs/toolkit';
import { mockRequests } from '../utils/dummyData';

const initialState = {
  requests: [...mockRequests],
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

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
    addRequest: (state, action) => {
      state.requests.unshift(action.payload);
    },
    updateRequest: (state, action) => {
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = { ...state.requests[index], ...action.payload };
      }
      if (state.currentRequest?.id === action.payload.id) {
        state.currentRequest = { ...state.currentRequest, ...action.payload };
      }
    },
    deleteRequest: (state, action) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

// Mock async actions
export const fetchRequests = (filters = {}) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filtered = [...mockRequests];
  
  if (filters.category) {
    filtered = filtered.filter((r) => r.category === filters.category);
  }
  if (filters.urgency) {
    filtered = filtered.filter((r) => r.urgency === filters.urgency);
  }
  if (filters.status) {
    filtered = filtered.filter((r) => r.status === filters.status);
  }
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
  }
  
  dispatch(setRequests(filtered));
  dispatch(setLoading(false));
};

export const fetchRequestById = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const request = mockRequests.find((r) => r.id === id);
  dispatch(setCurrentRequest(request || null));
  dispatch(setLoading(false));
};

export const createRequest = (requestData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const { user } = getState().user;
  const newRequest = {
    id: `req-${Date.now()}`,
    ...requestData,
    createdBy: user.id,
    createdByName: user.name,
    currentAmount: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    donorCount: 0,
  };
  
  dispatch(addRequest(newRequest));
  dispatch(setLoading(false));
  return { success: true, request: newRequest };
};

export const {
  setLoading,
  setError,
  setRequests,
  setCurrentRequest,
  addRequest,
  updateRequest,
  deleteRequest,
  setFilters,
  clearFilters,
} = requestsSlice.actions;

// Selectors
export const selectAllRequests = (state) => state.requests.requests;
export const selectCurrentRequest = (state) => state.requests.currentRequest;
export const selectRequestsLoading = (state) => state.requests.loading;
export const selectFilters = (state) => state.requests.filters;

export default requestsSlice.reducer;
