// Protected Admin Route Component
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Client app URL for redirects
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5174';

// Auth states
const AUTH_STATUS = {
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    NO_TOKEN: 'no_token',
    EXPIRED: 'expired',
    NOT_ADMIN: 'not_admin',
    INVALID: 'invalid',
};

/**
 * Protected route wrapper for admin pages
 * Uses jwt-decode to verify token from localStorage (same key used in client)
 * 
 * Auth Flow:
 * - No token → show login required message with link to client
 * - Token with role !== 'ADMIN' → show unauthorized message
 * - Valid admin token → render children
 * 
 * This component does NOT use window.location.href to avoid infinite loops
 */
const ProtectedAdminRoute = ({ children }) => {
    const location = useLocation();
    const [authStatus, setAuthStatus] = useState(AUTH_STATUS.LOADING);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Check auth status once on mount
        const checkAuth = () => {
            const token = localStorage.getItem('token');

            // No token
            if (!token) {
                setAuthStatus(AUTH_STATUS.NO_TOKEN);
                setErrorMessage('Please login to access the admin panel.');
                return;
            }

            try {
                // Decode the JWT token
                const decoded = jwtDecode(token);

                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expired - clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setAuthStatus(AUTH_STATUS.EXPIRED);
                    setErrorMessage('Your session has expired. Please login again.');
                    return;
                }

                // Check if user has admin role (case-insensitive check)
                const userRole = decoded.role?.toUpperCase();
                if (userRole !== 'ADMIN') {
                    setAuthStatus(AUTH_STATUS.NOT_ADMIN);
                    setErrorMessage(`Access denied. Admin role required. Your role: ${decoded.role || 'Unknown'}`);
                    return;
                }

                // Valid admin token
                setAuthStatus(AUTH_STATUS.AUTHENTICATED);
            } catch (error) {
                // Invalid token - clear storage
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthStatus(AUTH_STATUS.INVALID);
                setErrorMessage('Invalid authentication token. Please login again.');
            }
        };

        checkAuth();
    }, []);

    // Loading state
    if (authStatus === AUTH_STATUS.LOADING) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-secondary-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Authenticated - render children
    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
        return children;
    }

    // Not authenticated - Redirect to internal Admin Login
    const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

    // If not authenticated, force redirect immediately instead of showing error page
    return <Navigate to="/login" replace state={{ from: location }} />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {/* Icon based on status */}
                {authStatus === AUTH_STATUS.NOT_ADMIN ? (
                    <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-xl font-bold text-secondary-900 mb-2">
                    {authStatus === AUTH_STATUS.NOT_ADMIN ? 'Access Denied' : 'Authentication Required'}
                </h1>

                {/* Error message */}
                <p className="text-secondary-600 mb-6">{errorMessage}</p>

                {/* Action buttons */}
                <div className="space-y-3">
                    <a
                        href={loginUrl}
                        className="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Go to Login
                    </a>

                    {authStatus === AUTH_STATUS.NOT_ADMIN && (
                        <a
                            href={CLIENT_URL}
                            className="block w-full px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
                        >
                            Return to Main Site
                        </a>
                    )}
                </div>

                {/* Debug info in development */}
                {import.meta.env.DEV && (
                    <div className="mt-6 p-3 bg-secondary-50 rounded-lg text-left text-xs">
                        <p className="font-medium text-secondary-700 mb-1">Debug Info:</p>
                        <p className="text-secondary-500">Status: {authStatus}</p>
                        <p className="text-secondary-500">Client URL: {CLIENT_URL}</p>
                        <p className="text-secondary-500">Current Path: {location.pathname}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProtectedAdminRoute;
