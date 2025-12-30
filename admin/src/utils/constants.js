// Admin-Specific Constants and API Endpoints
// Note: This file only contains admin-specific constants
// Client constants (ROLES, CATEGORIES, etc.) are shared across the application

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

// =============================================================================
// ADMIN API ENDPOINTS
// =============================================================================

export const API_ENDPOINTS = {
  // Auth (uses client auth, admin just validates role)
  AUTH: {
    VALIDATE: '/api/auth/validate',
    REFRESH: '/api/auth/refresh',
  },

  // Admin Dashboard
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    STATS: '/api/admin/stats',
    ACTIVITY: '/api/admin/activity',
  },

  // Users Management
  USERS: {
    LIST: '/api/admin/users',
    DETAILS: (id) => `/api/admin/users/${id}`,
    UPDATE: (id) => `/api/admin/users/${id}`,
    DELETE: (id) => `/api/admin/users/${id}`,
    VERIFY: (id) => `/api/admin/users/${id}/verify`,
    BLOCK: (id) => `/api/admin/users/${id}/block`,
    UNBLOCK: (id) => `/api/admin/users/${id}/unblock`,
  },

  // Donations Management
  DONATIONS: {
    LIST: '/api/admin/donations',
    DETAILS: (id) => `/api/admin/donations/${id}`,
    UPDATE: (id) => `/api/admin/donations/${id}`,
    REFUND: (id) => `/api/admin/donations/${id}/refund`,
    EXPORT: '/api/admin/donations/export',
  },

  // Requests Management
  REQUESTS: {
    LIST: '/api/admin/requests',
    DETAILS: (id) => `/api/admin/requests/${id}`,
    UPDATE: (id) => `/api/admin/requests/${id}`,
    APPROVE: (id) => `/api/admin/requests/${id}/approve`,
    REJECT: (id) => `/api/admin/requests/${id}/reject`,
    FULFILL: (id) => `/api/admin/requests/${id}/fulfill`,
  },

  // Campaigns Management
  CAMPAIGNS: {
    LIST: '/api/admin/campaigns',
    DETAILS: (id) => `/api/admin/campaigns/${id}`,
    UPDATE: (id) => `/api/admin/campaigns/${id}`,
    PUBLISH: (id) => `/api/admin/campaigns/${id}/publish`,
    PAUSE: (id) => `/api/admin/campaigns/${id}/pause`,
    COMPLETE: (id) => `/api/admin/campaigns/${id}/complete`,
    CANCEL: (id) => `/api/admin/campaigns/${id}/cancel`,
  },

  // Reports
  REPORTS: {
    GENERATE: '/api/admin/reports/generate',
    DONATIONS: '/api/admin/reports/donations',
    USERS: '/api/admin/reports/users',
    CAMPAIGNS: '/api/admin/reports/campaigns',
    EXPORT: '/api/admin/reports/export',
  },

  // Settings
  SETTINGS: {
    GET: '/api/admin/settings',
    UPDATE: '/api/admin/settings',
    NOTIFICATIONS: '/api/admin/settings/notifications',
  },
};

// =============================================================================
// ADMIN-SPECIFIC ENUMS
// =============================================================================

// Admin action types for audit logging
export const ADMIN_ACTIONS = {
  USER_VERIFIED: 'USER_VERIFIED',
  USER_BLOCKED: 'USER_BLOCKED',
  USER_UNBLOCKED: 'USER_UNBLOCKED',
  REQUEST_APPROVED: 'REQUEST_APPROVED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  CAMPAIGN_PUBLISHED: 'CAMPAIGN_PUBLISHED',
  CAMPAIGN_PAUSED: 'CAMPAIGN_PAUSED',
  DONATION_REFUNDED: 'DONATION_REFUNDED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
};

// Report types available in admin
export const REPORT_TYPES = {
  DONATIONS: 'donations',
  USERS: 'users',
  CAMPAIGNS: 'campaigns',
  REQUESTS: 'requests',
  FINANCIAL: 'financial',
};

// Date range presets for filters/reports
export const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  ALL: 'all',
  CUSTOM: 'custom',
};

// =============================================================================
// PAGINATION DEFAULTS
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
};

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const SIDEBAR_WIDTH = 256; // 16rem in pixels
export const NAVBAR_HEIGHT = 64; // 4rem in pixels

// Toast/notification durations
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// =============================================================================
// STATUS MAPPINGS (Admin-specific display)
// =============================================================================

export const STATUS_BADGES = {
  // User verification status
  VERIFIED: { variant: 'success', label: 'Verified' },
  PENDING: { variant: 'warning', label: 'Pending' },
  UNVERIFIED: { variant: 'default', label: 'Unverified' },
  REJECTED: { variant: 'danger', label: 'Rejected' },

  // Transaction status
  COMPLETED: { variant: 'success', label: 'Completed' },
  PROCESSING: { variant: 'warning', label: 'Processing' },
  FAILED: { variant: 'danger', label: 'Failed' },
  REFUNDED: { variant: 'info', label: 'Refunded' },

  // Campaign status
  ACTIVE: { variant: 'success', label: 'Active' },
  DRAFT: { variant: 'warning', label: 'Draft' },
  PAUSED: { variant: 'warning', label: 'Paused' },
  CANCELLED: { variant: 'danger', label: 'Cancelled' },

  // Request status
  APPROVED: { variant: 'success', label: 'Approved' },
  FULFILLED: { variant: 'info', label: 'Fulfilled' },
  CLOSED: { variant: 'default', label: 'Closed' },
};

// =============================================================================
// SHARED CONSTANTS (from backend enums)
// =============================================================================

// These match the backend enums for consistency
export const ROLES = {
  ADMIN: 'ADMIN',
  DONOR: 'DONOR',
  VOLUNTEER: 'VOLUNTEER',
  NGO: 'NGO',
};

export const DONATION_CATEGORIES = {
  ZAKAT: 'ZAKAT',
  SADAQAH: 'SADAQAH',
  FIDYA: 'FIDYA',
  KAFFARAH: 'KAFFARAH',
  WAQF: 'WAQF',
  GENERAL: 'GENERAL',
};

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FULFILLED: 'FULFILLED',
  CLOSED: 'CLOSED',
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

export const URGENCY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export default {
  API_BASE_URL,
  CLIENT_URL,
  API_ENDPOINTS,
  ADMIN_ACTIONS,
  REPORT_TYPES,
  DATE_RANGES,
  PAGINATION,
  STATUS_BADGES,
  ROLES,
  DONATION_CATEGORIES,
  REQUEST_STATUS,
  CAMPAIGN_STATUS,
  TRANSACTION_STATUS,
  VERIFICATION_STATUS,
  URGENCY_LEVELS,
};