// Reports Slice - Report generation state
import { createSlice } from '@reduxjs/toolkit';

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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setReportType: (state, action) => {
      state.reportType = action.payload;
      state.reportData = null; // Clear previous data when type changes
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    addGeneratedReport: (state, action) => {
      state.generatedReports.unshift({
        id: `report-${Date.now()}`,
        ...action.payload,
        generatedAt: new Date().toISOString(),
      });
    },
    deleteReport: (state, action) => {
      state.generatedReports = state.generatedReports.filter(
        (r) => r.id !== action.payload
      );
    },
    clearReportData: (state) => {
      state.reportData = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setReportType,
  setDateRange,
  setReportData,
  addGeneratedReport,
  deleteReport,
  clearReportData,
} = reportsSlice.actions;

// Selectors
export const selectReportType = (state) => state.reports.reportType;
export const selectDateRange = (state) => state.reports.dateRange;
export const selectReportData = (state) => state.reports.reportData;
export const selectGeneratedReports = (state) => state.reports.generatedReports;
export const selectReportsLoading = (state) => state.reports.loading;
export const selectReportsError = (state) => state.reports.error;

export default reportsSlice.reducer;
