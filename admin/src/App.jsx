// Admin Panel - Main App Component
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import AdminRoutes from './routes/AdminRoutes';
import { setAdminData } from './store/adminSlice';

function App() {
  const dispatch = useDispatch();

  // Extract admin info from existing JWT on app load
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode JWT to get admin info (id, email, name, role)
        const decoded = jwtDecode(token);

        // Check if token is not expired
        const currentTime = Date.now() / 1000;
        if (!decoded.exp || decoded.exp > currentTime) {
          // Set admin data in store (only id, email, name, role)
          dispatch(setAdminData({
            id: decoded.id || decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
          }));
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  }, [dispatch]);

  return <AdminRoutes />;
}

export default App;
