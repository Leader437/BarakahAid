// Redux Store Configuration - Combines all slices
import { configureStore } from '@reduxjs/toolkit';

// Import all slices
import adminReducer from './adminSlice';
import usersReducer from './usersSlice';
import donationsReducer from './donationsSlice';
import requestsReducer from './requestsSlice';
import campaignsReducer from './campaignsSlice';
import reportsReducer from './reportsSlice';
import settingsReducer from './settingsSlice';

/**
 * Admin Panel Redux Store
 * Combines: admin, users, donations, requests, campaigns, reports, settings
 * Uses mock data from dummyData.js for development
 */
const store = configureStore({
  reducer: {
    admin: adminReducer,
    users: usersReducer,
    donations: donationsReducer,
    requests: requestsReducer,
    campaigns: campaignsReducer,
    reports: reportsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for dates in mock data
    }),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

export default store;
