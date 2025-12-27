// useAdmin.js - Admin authentication and utility hook
import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { logout as logoutAction } from '../store/adminSlice';

// Admin-specific localStorage keys (only these are cleared on logout)
const ADMIN_STORAGE_KEYS = [
  'adminTheme',
  'adminNotifications',
  'adminProfile',
  'adminSidebarCollapsed',
];

/**
 * Custom hook for admin authentication and utilities
 * Reads and decodes JWT, provides admin info and logout method
 * 
 * @returns {Object} Admin state and utility functions
 */
const useAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Get and decode JWT token from localStorage
   * Returns null if token is invalid or expired
   */
  const getDecodedToken = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return null;
      }

      const decoded = jwtDecode(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn('Token has expired');
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  /**
   * Admin info extracted from JWT
   */
  const admin = useMemo(() => {
    const decoded = getDecodedToken();
    
    if (!decoded) {
      return null;
    }

    return {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.email?.split('@')[0] || 'Admin',
      role: decoded.role,
      isAdmin: decoded.role?.toUpperCase() === 'ADMIN',
    };
  }, [getDecodedToken]);

  /**
   * Check if user is authenticated as admin
   */
  const isAuthenticated = useMemo(() => {
    return admin !== null && admin.isAdmin;
  }, [admin]);

  /**
   * Get the raw JWT token
   */
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  /**
   * Logout - clears only admin-specific localStorage items
   * Preserves the main 'token' and 'user' keys for client app
   */
  const logout = useCallback(() => {
    // Clear admin-specific localStorage items only
    ADMIN_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Note: We do NOT remove 'token' or 'user' here
    // Those are managed by the client app's authentication
    // The admin panel just reads them

    // Dispatch Redux logout action
    dispatch(logoutAction());

    // Redirect to client login page
    const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';
    window.location.href = `${clientUrl}/login`;
  }, [dispatch]);

  /**
   * Full logout - also clears token (use when admin explicitly logs out)
   */
  const fullLogout = useCallback(() => {
    // Clear all admin-specific items
    ADMIN_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Also clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch Redux logout action
    dispatch(logoutAction());

    // Redirect to client login page
    const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';
    window.location.href = `${clientUrl}/login`;
  }, [dispatch]);

  /**
   * Check if admin has a specific permission
   * Placeholder for future permission system
   */
  const hasPermission = useCallback((permission) => {
    // For now, all admins have all permissions
    if (!admin?.isAdmin) {
      return false;
    }

    // TODO: Implement granular permissions when backend supports it
    // const permissions = admin.permissions || [];
    // return permissions.includes(permission);

    return true;
  }, [admin]);

  /**
   * Format currency with default USD
   */
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }, []);

  /**
   * Format date with default locale
   */
  const formatDate = useCallback((date, options = {}) => {
    if (!date) return 'N/A';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };

    try {
      return new Date(date).toLocaleDateString('en-US', defaultOptions);
    } catch {
      return 'Invalid Date';
    }
  }, []);

  /**
   * Format date and time
   */
  const formatDateTime = useCallback((date) => {
    if (!date) return 'N/A';

    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  /**
   * Get time ago string
   */
  const timeAgo = useCallback((date) => {
    if (!date) return 'N/A';

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }, []);

  return {
    // Admin info
    admin,
    isAuthenticated,

    // Token utilities
    getToken,
    getDecodedToken,

    // Auth actions
    logout,
    fullLogout,

    // Permissions
    hasPermission,

    // Formatting utilities
    formatCurrency,
    formatDate,
    formatDateTime,
    timeAgo,
  };
};

export default useAdmin;
