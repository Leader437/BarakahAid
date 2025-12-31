// Helper utility functions

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format datetime to readable string
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format large numbers (e.g., 1000 -> 1K)
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'text-warning-600 bg-warning-50',
    approved: 'text-success-600 bg-success-50',
    active: 'text-primary-600 bg-primary-50',
    fulfilled: 'text-success-700 bg-success-100',
    rejected: 'text-danger-600 bg-danger-50',
    expired: 'text-secondary-600 bg-secondary-100',
    completed: 'text-success-600 bg-success-50',
    failed: 'text-danger-600 bg-danger-50',
    processing: 'text-primary-600 bg-primary-50',
    verified: 'text-success-600 bg-success-50',
    cancelled: 'text-secondary-600 bg-secondary-100',
  };
  return statusColors[status?.toLowerCase()] || 'text-secondary-600 bg-secondary-100';
};

/**
 * Get urgency color class
 */
export const getUrgencyColor = (urgency) => {
  const urgencyColors = {
    low: 'text-secondary-600 bg-secondary-50',
    medium: 'text-warning-600 bg-warning-50',
    high: 'text-danger-600 bg-danger-50',
    critical: 'text-danger-700 bg-danger-100',
  };
  return urgencyColors[urgency?.toLowerCase()] || 'text-secondary-600 bg-secondary-50';
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Get dashboard path based on role
 */
export const getDashboardPath = (role) => {
  if (!role) return '/';

  const normalizedRole = role.toLowerCase();

  switch (normalizedRole) {
    case 'donor':
      return '/donor/dashboard';
    case 'volunteer':
      return '/volunteer/dashboard';
    case 'recipient':
      return '/recipient/dashboard'; // Placeholder
    case 'ngo':
      return '/ngo/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      console.warn(`Unknown role encountered: ${role}. Defaulting to /donor/dashboard`);
      return '/donor/dashboard';
  }
};
