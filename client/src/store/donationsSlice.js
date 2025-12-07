// Donations Slice - Donation tracking and management
import { createSlice } from '@reduxjs/toolkit';
import { mockDonations } from '../utils/dummyData';

const initialState = {
  donations: [...mockDonations],
  loading: false,
  error: null,
  processingDonation: null,
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
    },
    addDonation: (state, action) => {
      state.donations.unshift(action.payload);
    },
    updateDonation: (state, action) => {
      const index = state.donations.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.donations[index] = { ...state.donations[index], ...action.payload };
      }
    },
    setProcessingDonation: (state, action) => {
      state.processingDonation = action.payload;
    },
  },
});

// Mock async actions
export const fetchDonations = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const userDonations = mockDonations.filter((d) => d.donorId === userId);
  dispatch(setDonations(userDonations));
  dispatch(setLoading(false));
};

export const makeDonation = (donationData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  try {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const { user } = getState().user;
    const newDonation = {
      id: `don-${Date.now()}`,
      donorId: user.id,
      donorName: user.name,
      ...donationData,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    
    dispatch(addDonation(newDonation));
    dispatch(setLoading(false));
    
    // Update request amount (mock)
    return { success: true, donation: newDonation };
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    return { success: false, error: error.message };
  }
};

export const getDonationStats = (userId) => async (dispatch) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const userDonations = mockDonations.filter((d) => d.donorId === userId);
  
  const stats = {
    totalDonated: userDonations.reduce((sum, d) => sum + d.amount, 0),
    totalDonations: userDonations.length,
    completedDonations: userDonations.filter((d) => d.status === 'completed').length,
    pendingDonations: userDonations.filter((d) => d.status === 'pending').length,
  };
  
  return stats;
};

export const {
  setLoading,
  setError,
  setDonations,
  addDonation,
  updateDonation,
  setProcessingDonation,
} = donationsSlice.actions;

// Selectors
export const selectDonations = (state) => state.donations.donations;
export const selectDonationsLoading = (state) => state.donations.loading;
export const selectDonationsError = (state) => state.donations.error;

export default donationsSlice.reducer;
