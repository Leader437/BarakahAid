// Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import requestsReducer from './requestsSlice';
import donationsReducer from './donationsSlice';
import volunteerReducer from './volunteerSlice';
import ngoReducer from './ngoSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    requests: requestsReducer,
    donations: donationsReducer,
    volunteer: volunteerReducer,
    ngo: ngoReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
