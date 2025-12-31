// Reports Slice - Report generation and analytics
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Async Thunks
export const fetchAnalytics = createAsyncThunk(
  'reports/fetchAnalytics',
  async ({ type, dateRange }, { rejectWithValue }) => {
    try {
      let endpoint = '/admin/analytics';
      // Map slice types to API endpoints (based on modules/admin/admin.controller.ts)
      switch (type) {
          case 'users':
              endpoint = '/admin/analytics/users';
              break;
          case 'campaigns':
              endpoint = '/admin/analytics/campaigns';
              break;
          case 'activity':
              endpoint = '/admin/analytics/activity';
              break;
          case 'donations':
          default:
              endpoint = '/admin/analytics'; // Global analytics usually includes donations
              break;
      }
      
      const response = await api.get(endpoint, { params: { period: dateRange } });
      return { type, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async ({ type, dateRange }, { rejectWithValue }) => {
    try {
      // Using /admin/reports/global?period=...
      // Ensuring responseType is blob for PDF
      const response = await api.get('/admin/reports/global', { 
          params: { period: dateRange },
          responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${type}-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { 
          id: `rep-${Date.now()}`,
          type,
          dateRange,
          generatedAt: new Date().toISOString()
      };
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

const initialState = {
  reportType: 'donations',
  dateRange: 'month',
  reportData: null,
  generatedReports: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReportType: (state, action) => {
      state.reportType = action.payload;
      state.reportData = null; 
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearReportData: (state) => {
      state.reportData = null;
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
      // Fetch Analytics
      builder
        .addCase(fetchAnalytics.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAnalytics.fulfilled, (state, action) => {
            state.loading = false;
            state.reportData = action.payload.data;
        })
        .addCase(fetchAnalytics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

      // Generate Report
      builder
        .addCase(generateReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(generateReport.fulfilled, (state, action) => {
            state.loading = false;
            state.generatedReports.unshift(action.payload);
        })
        .addCase(generateReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
  }
});

export const {
  setReportType,
  setDateRange,
  clearReportData,
  clearError
} = reportsSlice.actions;

// Selectors
export const selectReportType = (state) => state.reports.reportType;
export const selectDateRange = (state) => state.reports.dateRange;
export const selectReportData = (state) => state.reports.reportData;
export const selectGeneratedReports = (state) => state.reports.generatedReports;
export const selectReportsLoading = (state) => state.reports.loading;
export const selectReportsError = (state) => state.reports.error;

export default reportsSlice.reducer;
