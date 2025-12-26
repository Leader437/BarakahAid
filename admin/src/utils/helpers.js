// Admin Helper Functions
// Utility functions for formatting, transformation, and common operations

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
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
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date) => {
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
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const timeAgo = (date) => {
  if (!date) return 'N/A';

  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return 'Just now';

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
  ];

  for (const { unit, seconds: intervalSeconds } of intervals) {
    const interval = Math.floor(seconds / intervalSeconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

// =============================================================================
// CURRENCY FORMATTING
// =============================================================================

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {boolean} compact - Use compact notation for large numbers
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', compact = false) => {
  if (amount === null || amount === undefined) return '$0';

  const options = {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  if (compact && Math.abs(amount) >= 1000) {
    options.notation = 'compact';
    options.compactDisplay = 'short';
  }

  return new Intl.NumberFormat('en-US', options).format(amount);
};

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// =============================================================================
// TEXT FORMATTING
// =============================================================================

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize each word in string
 * @param {string} str - String to title case
 * @returns {string} Title-cased string
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} count - Number of initials (default: 2)
 * @returns {string} Initials
 */
export const getInitials = (name, count = 2) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, count)
    .toUpperCase();
};

/**
 * Slugify string for URLs
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// =============================================================================
// STATUS HELPERS
// =============================================================================

/**
 * Get badge variant for verification status
 * @param {string} status - Verification status
 * @returns {string} Badge variant
 */
export const getVerificationVariant = (status) => {
  const variants = {
    VERIFIED: 'success',
    PENDING: 'warning',
    UNVERIFIED: 'default',
    REJECTED: 'danger',
  };
  return variants[status] || 'default';
};

/**
 * Get badge variant for transaction status
 * @param {string} status - Transaction status
 * @returns {string} Badge variant
 */
export const getTransactionVariant = (status) => {
  const variants = {
    COMPLETED: 'success',
    PENDING: 'warning',
    FAILED: 'danger',
    REFUNDED: 'info',
  };
  return variants[status] || 'default';
};

/**
 * Get badge variant for campaign status
 * @param {string} status - Campaign status
 * @returns {string} Badge variant
 */
export const getCampaignVariant = (status) => {
  const variants = {
    ACTIVE: 'success',
    DRAFT: 'warning',
    PAUSED: 'warning',
    COMPLETED: 'info',
    CANCELLED: 'danger',
  };
  return variants[status] || 'default';
};

/**
 * Get badge variant for role
 * @param {string} role - User role
 * @returns {string} Badge variant
 */
export const getRoleVariant = (role) => {
  const variants = {
    ADMIN: 'danger',
    NGO: 'primary',
    VOLUNTEER: 'success',
    DONOR: 'info',
  };
  return variants[role] || 'default';
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms (default: 300)
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix (default: 'id')
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== '' && value !== null && value !== undefined
  );

  if (filtered.length === 0) return '';

  return '?' + filtered.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.min(Math.round((value / total) * 100), 100);
};

/**
 * Download file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename for download
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default {
  formatDate,
  formatDateTime,
  timeAgo,
  formatCurrency,
  formatNumber,
  formatPercentage,
  capitalize,
  titleCase,
  truncate,
  getInitials,
  slugify,
  getVerificationVariant,
  getTransactionVariant,
  getCampaignVariant,
  getRoleVariant,
  debounce,
  generateId,
  deepClone,
  isEmpty,
  buildQueryString,
  calculatePercentage,
  downloadBlob,
};
