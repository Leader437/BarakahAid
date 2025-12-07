// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Donor Menu Items
const donorMenuItems = [
  {
    path: '/donor/dashboard',
    label: 'Dashboard',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/donor/browse-requests',
    label: 'Browse Requests',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    path: '/donor/donation-history',
    label: 'My Donations',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Show Navbar on all pages except login and register */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        {/* Main Content */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/donor/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/donor/dashboard" /> : <Register />} />

          {/* Donor Routes */}
          <Route
            path="/donor/*"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout menuItems={donorMenuItems}>
                  <Routes>
                    <Route path="dashboard" element={<DonorDashboard />} />
                    <Route path="browse-requests" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Browse Requests - Coming Soon</h2></div>} />
                    <Route path="donation-history" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Donation History - Coming Soon</h2></div>} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Recipient Routes - Placeholder */}
          <Route
            path="/recipient/*"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold">Recipient Dashboard - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Volunteer Routes - Placeholder */}
          <Route
            path="/volunteer/*"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold">Volunteer Dashboard - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          {/* NGO Routes - Placeholder */}
          <Route
            path="/ngo/*"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold">NGO Dashboard - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Placeholder */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold">Admin Dashboard - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-secondary-300">404</h1>
                <p className="text-xl text-secondary-600 mt-4">Page not found</p>
              </div>
            </div>
          } />
        </Routes>

        {/* Footer - Hidden on landing page (has its own), login and register */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;