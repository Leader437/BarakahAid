// Donations Slice - Donation tracking and management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  donations: [],
  loading: false,
  error: null,
  processingDonation: null,
  stats: {
    totalDonated: 0,
    totalDonations: 0,
    completedDonations: 0,
    pendingDonations: 0,
  }
};

// Async Thunks
export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions/my-donations'); 
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch donations');
    }
  }
);

export const makeDonation = createAsyncThunk(
  'donations/makeDonation',
  async (donationData, { rejectWithValue }) => {
    try {
      // Maps frontend donationData to CreateTransactionDto
      const payload = {
          amount: donationData.amount,
          campaignId: donationData.campaignId,
          currency: 'USD',
          paymentGateway: 'CARD', // Default for now
          // donorName/Email inferred from auth usually, or passed
      };
      const response = await api.post('/transactions', payload);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Donation failed');
    }
  }
);

// ... getDonationStats (keep as null or implement local calc)

const donationsSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    setProcessingDonation: (state, action) => {
      state.processingDonation = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchDonations.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchDonations.fulfilled, (state, action) => {
            state.loading = false;
            // Handle different response structures (data.data or direct array)
            const rawData = action.payload.data || action.payload;
            const data = Array.isArray(rawData) ? rawData : [];
            
            // Map backend Transaction entity to frontend Donation model if needed
            // Backend: { id, amount, status, campaign: { title }, createdAt }
            // Frontend wanted: { id, campaignName, amount, date, status, category, impact }
            
            state.donations = data.map(tx => ({
                id: tx.id,
                campaignName: tx.campaign?.title || 'Unknown Campaign',
                amount: Number(tx.amount),
                date: tx.createdAt,
                status: tx.status.toLowerCase(), // backend is UPPERCASE
                category: tx.campaign?.category?.name || 'General',
                paymentMethod: tx.paymentGateway,
                taxReceiptId: tx.receiptUrl ? 'Available' : null,
                impact: 'View details' // Placeholder
            }));
            
            // Calculate stats locally
            state.stats = {
                totalDonated: state.donations.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0),
                totalDonations: state.donations.length,
                completedDonations: state.donations.filter(d => d.status === 'completed').length,
                pendingDonations: state.donations.filter(d => d.status === 'pending').length,
            };
        })
        .addCase(fetchDonations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(makeDonation.pending, (state) => {
             state.loading = true;
             state.error = null;
        })
        .addCase(makeDonation.fulfilled, (state, action) => {
             state.loading = false;
             // Optimistically add or just re-fetch. 
             // Re-fetching is safer using dispatch(fetchDonations()) in component.
             // But here we can append if we return the full transaction.
             // For now, let's assume component re-fetches.
        })
        .addCase(makeDonation.rejected, (state, action) => {
             state.loading = false;
             state.error = action.payload;
        });
  }
});

export const {
  setProcessingDonation,
  clearError
} = donationsSlice.actions;

// Selectors
export const selectDonations = (state) => state.donations.donations;
export const selectDonationsLoading = (state) => state.donations.loading;
export const selectDonationsError = (state) => state.donations.error;
export const selectDonationsStats = (state) => state.donations.stats;

export default donationsSlice.reducer;
