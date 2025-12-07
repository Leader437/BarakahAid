// NGO Slice - NGO and campaign management
import { createSlice } from '@reduxjs/toolkit';
import { mockCampaigns } from '../utils/dummyData';

const initialState = {
  campaigns: [...mockCampaigns],
  myCampaigns: [],
  loading: false,
  error: null,
};

const ngoSlice = createSlice({
  name: 'ngo',
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
    },
    setMyCampaigns: (state, action) => {
      state.myCampaigns = action.payload;
    },
    addCampaign: (state, action) => {
      state.campaigns.unshift(action.payload);
      state.myCampaigns.unshift(action.payload);
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = { ...state.campaigns[index], ...action.payload };
      }
      const myIndex = state.myCampaigns.findIndex((c) => c.id === action.payload.id);
      if (myIndex !== -1) {
        state.myCampaigns[myIndex] = { ...state.myCampaigns[myIndex], ...action.payload };
      }
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      state.myCampaigns = state.myCampaigns.filter((c) => c.id !== action.payload);
    },
  },
});

// Mock async actions
export const fetchCampaigns = () => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  dispatch(setCampaigns(mockCampaigns));
  dispatch(setLoading(false));
};

export const fetchMyCampaigns = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const userCampaigns = mockCampaigns.filter((c) => c.createdBy === userId);
  dispatch(setMyCampaigns(userCampaigns));
  dispatch(setLoading(false));
};

export const createCampaign = (campaignData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const { user } = getState().user;
  const newCampaign = {
    id: `camp-${Date.now()}`,
    ...campaignData,
    createdBy: user.id,
    organizationName: user.name,
    currentAmount: 0,
    status: 'active',
    startDate: new Date().toISOString(),
    donorCount: 0,
    volunteers: 0,
  };
  
  dispatch(addCampaign(newCampaign));
  dispatch(setLoading(false));
  return { success: true, campaign: newCampaign };
};

export const {
  setLoading,
  setError,
  setCampaigns,
  setMyCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} = ngoSlice.actions;

// Selectors
export const selectCampaigns = (state) => state.ngo.campaigns;
export const selectMyCampaigns = (state) => state.ngo.myCampaigns;
export const selectNgoLoading = (state) => state.ngo.loading;

export default ngoSlice.reducer;
