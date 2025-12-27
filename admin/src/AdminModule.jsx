// Admin Module Entry Point for Client Integration
// This file allows the admin panel to be lazy-loaded into the client app

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

// Layout
import AdminLayout from './layout/AdminLayout';

// Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersList from './pages/users/UsersList';
import UserDetails from './pages/users/UserDetails';
import DonationsList from './pages/donations/DonationsList';
import DonationDetails from './pages/donations/DonationDetails';
import RequestsList from './pages/requests/RequestsList';
import RequestDetails from './pages/requests/RequestDetails';
import CampaignsList from './pages/campaigns/CampaignsList';
import CampaignDetails from './pages/campaigns/CampaignDetails';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Shared Components
import { NotFound } from './components/shared';

/**
 * Admin Module Component
 * Wraps all admin routes with Redux store and layout
 * This module is designed to be lazy-loaded from the client app
 */
const AdminModule = () => {
    return (
        <Provider store={store}>
            <AdminLayout>
                <Routes>
                    {/* Dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
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

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AdminLayout>
        </Provider>
    );
};

export default AdminModule;
