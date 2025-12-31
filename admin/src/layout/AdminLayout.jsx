// Admin Layout Component - Main wrapper for admin pages
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

import { useDispatch } from 'react-redux';
import { setAdminData, getAdminProfile } from '../store/adminSlice';

/**
 * Admin Layout combining Sidebar + Navbar + Outlet (react-router)
 * Responsive design with collapsible sidebar on mobile
 */
const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    // Initialize admin data from localStorage (shared with client app)
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role && (user.role.toLowerCase() === 'admin')) {
                    dispatch(setAdminData(user));
                    // Fetch latest profile to get avatar
                    dispatch(getAdminProfile());
                }
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, [dispatch]);

    // Close sidebar on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Fixed Navbar */}
            <AdminNavbar
                onMenuToggle={handleMenuToggle}
                isSidebarOpen={sidebarOpen}
            />

            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
            />

            {/* Main Content Area */}
            <div className="lg:pl-64 pt-16 min-h-screen flex flex-col">
                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children || <Outlet />}
                </main>

                {/* Footer */}
                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminLayout;
