// Admin Routes Configuration
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from '../layout/AdminLayout';

// Protected Route
import ProtectedAdminRoute from './ProtectedAdminRoute';

// Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersList from '../pages/users/UsersList';
import UserDetails from '../pages/users/UserDetails';
import DonationsList from '../pages/donations/DonationsList';
import DonationDetails from '../pages/donations/DonationDetails';
import RequestsList from '../pages/requests/RequestsList';
import RequestDetails from '../pages/requests/RequestDetails';
import CampaignsList from '../pages/campaigns/CampaignsList';
import CampaignDetails from '../pages/campaigns/CampaignDetails';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';

// Shared Components
import { NotFound } from '../components/shared';

/**
 * Admin Routes Configuration
 * All routes are protected by ProtectedAdminRoute which:
 * - Reads 'token' from localStorage (same key used in client)
 * - Decodes token using jwt-decode
 * - Validates admin role
 * - Redirects to client login/home if unauthorized
 */
const AdminRoutes = () => {
    return (
        <Routes>
            {/* All admin routes are protected */}
            <Route
                path="/"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout />
                    </ProtectedAdminRoute>
                }
            >
                {/* Dashboard - Default route */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />

                {/* Users Management */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/:id" element={<UserDetails />} />

                {/* Donations Management */}
                <Route path="donations" element={<DonationsList />} />
                <Route path="donations/:id" element={<DonationDetails />} />

                {/* Requests Management */}
                <Route path="requests" element={<RequestsList />} />
                <Route path="requests/:id" element={<RequestDetails />} />

                {/* Campaigns Management */}
                <Route path="campaigns" element={<CampaignsList />} />
                <Route path="campaigns/:id" element={<CampaignDetails />} />

                {/* Reports */}
                <Route path="reports" element={<ReportsPage />} />

                {/* Settings */}
                <Route path="settings" element={<SettingsPage />} />

                {/* Catch all unknown routes - show 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
