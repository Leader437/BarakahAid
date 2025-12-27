// Settings Slice - Platform settings state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  general: {
    platformName: 'BarakahAid',
    contactEmail: 'admin@barakahaid.com',
    supportPhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'UTC',
  },
  notifications: {
    emailNotifications: true,
    campaignAlerts: true,
    emergencyAlerts: true,
    donationAlerts: true,
    weeklyReports: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    ipWhitelist: [],
  },
  loading: false,
  error: null,
  saved: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setGeneralSettings: (state, action) => {
      state.general = { ...state.general, ...action.payload };
      state.saved = false;
    },
    setNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
      state.saved = false;
    },
    setSecuritySettings: (state, action) => {
      state.security = { ...state.security, ...action.payload };
      state.saved = false;
    },
    saveSettings: (state) => {
      state.saved = true;
      state.loading = false;
    },
    resetSettings: (state) => {
      state.general = initialState.general;
      state.notifications = initialState.notifications;
      state.security = initialState.security;
      state.saved = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setGeneralSettings,
  setNotificationSettings,
  setSecuritySettings,
  saveSettings,
  resetSettings,
} = settingsSlice.actions;

// Selectors
export const selectGeneralSettings = (state) => state.settings.general;
export const selectNotificationSettings = (state) => state.settings.notifications;
export const selectSecuritySettings = (state) => state.settings.security;
export const selectSettingsLoading = (state) => state.settings.loading;
export const selectSettingsError = (state) => state.settings.error;
export const selectSettingsSaved = (state) => state.settings.saved;

export default settingsSlice.reducer;
