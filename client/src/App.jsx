// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import OAuthCallback from './pages/auth/OAuthCallback';
import RoleSelection from './pages/auth/RoleSelection';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonationHistory from './pages/donor/DonationHistory';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/Dashboard';
import BrowseEvents from './pages/volunteer/BrowseEvents';
import MyActivities from './pages/volunteer/MyActivities';

// NGO Pages
import NgoDashboard from './pages/ngo/Dashboard';
import ManageCampaigns from './pages/ngo/ManageCampaigns';
import DonationsReceived from './pages/ngo/DonationsReceived';
import OrganizationProfile from './pages/ngo/OrganizationProfile';

// Browse Requests and Campaigns
import BrowseRequests from './pages/BrowseRequests';
import Campaigns from './pages/Campaigns';
import Donate from './pages/Donate';

// Emergency Module
import Emergency from './pages/Emergency';

// Profile Page
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.toLowerCase())) {
    console.warn('🚫 Access denied. User role:', user?.role, 'Allowed roles:', allowedRoles);
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

// Volunteer Menu Items
const volunteerMenuItems = [
  {
    path: '/volunteer/dashboard',
    label: 'Dashboard',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/volunteer/browse-events',
    label: 'Browse Events',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/volunteer/my-activities',
    label: 'My Activities',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

// NGO Menu Items
const ngoMenuItems = [
  {
    path: '/ngo/dashboard',
    label: 'Dashboard',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/ngo/campaigns',
    label: 'Manage Campaigns',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    path: '/ngo/donations',
    label: 'Donations Received',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    path: '/ngo/profile',
    label: 'Organization Profile',
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const getDashboardPath = (role) => {
    switch (role) {
      case 'donor':
        return '/donor/dashboard';
      case 'volunteer':
        return '/volunteer/dashboard';
      case 'recipient':
        return '/recipient/dashboard';
      case 'ngo':
        return '/ngo/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/donor/dashboard';
    }
  };

  return (
    <Router>
      <ScrollToTop />
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
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/browse-requests" element={<BrowseRequests />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardPath(user?.role)} /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboardPath(user?.role)} /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/select-role" element={<RoleSelection />} />

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout menuItems={donorMenuItems} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/donor/dashboard" replace />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="browse-requests" element={<BrowseRequests />} />
            <Route path="donation-history" element={<DonationHistory />} />
          </Route>

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

          {/* Volunteer Routes */}
          <Route
            path="/volunteer"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <DashboardLayout menuItems={volunteerMenuItems} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/volunteer/dashboard" replace />} />
            <Route path="dashboard" element={<VolunteerDashboard />} />
            <Route path="browse-events" element={<BrowseEvents />} />
            <Route path="my-activities" element={<MyActivities />} />
          </Route>

          {/* NGO Routes */}
          <Route
            path="/ngo"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <DashboardLayout menuItems={ngoMenuItems} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/ngo/dashboard" replace />} />
            <Route path="dashboard" element={<NgoDashboard />} />
            <Route path="campaigns" element={<ManageCampaigns />} />
            <Route path="donations" element={<DonationsReceived />} />
            <Route path="profile" element={<OrganizationProfile />} />
          </Route>

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
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-secondary-300">404</h1>
                <p className="mt-4 text-xl text-secondary-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>

        {/* Footer - Hidden on landing page (has its own), login, register, and dashboard pages */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="/donor/*" element={null} />
          <Route path="/volunteer/*" element={null} />
          <Route path="/ngo/*" element={null} />
          <Route path="/recipient/*" element={null} />
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;