// Form Validation Utilities
// Simple validators for admin forms

// =============================================================================
// BASIC VALIDATORS
// =============================================================================

/**
 * Check if value is not empty
 * @param {any} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// LENGTH VALIDATORS
// =============================================================================

/**
 * Check minimum length
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @returns {boolean} True if meets minimum length
 */
export const minLength = (value, min) => {
  if (!value) return false;
  return String(value).length >= min;
};

/**
 * Check maximum length
 * @param {string} value - Value to check
 * @param {number} max - Maximum length
 * @returns {boolean} True if within maximum length
 */
export const maxLength = (value, max) => {
  if (!value) return true; // Empty values pass max check
  return String(value).length <= max;
};

/**
 * Check length range
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} True if within range
 */
export const lengthBetween = (value, min, max) => {
  return minLength(value, min) && maxLength(value, max);
};

// =============================================================================
// NUMBER VALIDATORS
// =============================================================================

/**
 * Check if value is a positive number
 * @param {number} value - Value to check
 * @returns {boolean} True if positive number
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Check if value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if within range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Check if value is a valid amount (for donations)
 * @param {number} amount - Amount to check
 * @param {number} minAmount - Minimum amount (default: 1)
 * @returns {boolean} True if valid amount
 */
export const isValidAmount = (amount, minAmount = 1) => {
  const num = Number(amount);
  return !isNaN(num) && num >= minAmount;
};

// =============================================================================
// DATE VALIDATORS
// =============================================================================

/**
 * Check if date is valid
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if future date
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if past date
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Check if end date is after start date
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} True if end is after start
 */
export const isDateAfter = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  return new Date(endDate) > new Date(startDate);
};

// =============================================================================
// FORM VALIDATION HELPER
// =============================================================================

/**
 * Validate entire form based on rules
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} { isValid, errors }
 */
export const validateForm = (values, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// =============================================================================
// VALIDATION RULE FACTORIES
// =============================================================================

/**
 * Create required field rule
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const required = (message = 'This field is required') => {
  return (value) => (!isRequired(value) ? message : null);
};

/**
 * Create email validation rule
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const email = (message = 'Please enter a valid email') => {
  return (value) => (value && !isValidEmail(value) ? message : null);
};

/**
 * Create min length rule
 * @param {number} min - Minimum length
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const min = (minVal, message) => {
  return (value) => {
    if (!value) return null;
    return !minLength(value, minVal)
      ? message || `Must be at least ${minVal} characters`
      : null;
  };
};

/**
 * Create max length rule
 * @param {number} max - Maximum length
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const max = (maxVal, message) => {
  return (value) => {
    if (!value) return null;
    return !maxLength(value, maxVal)
      ? message || `Must be no more than ${maxVal} characters`
      : null;
  };
};

/**
 * Create positive number rule
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const positiveNumber = (message = 'Must be a positive number') => {
  return (value) => (value && !isPositiveNumber(value) ? message : null);
};

/**
 * Create future date rule
 * @param {string} message - Error message
 * @returns {Function} Validation rule
 */
export const futureDate = (message = 'Date must be in the future') => {
  return (value) => (value && !isFutureDate(value) ? message : null);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Basic validators
  isRequired,
  isValidEmail,
  isValidPhone,
  isValidUrl,

  // Length validators
  minLength,
  maxLength,
  lengthBetween,

  // Number validators
  isPositiveNumber,
  isInRange,
  isValidAmount,

  // Date validators
  isValidDate,
  isFutureDate,
  isPastDate,
  isDateAfter,

  // Form validation
  validateForm,

  // Rule factories
  required,
  email,
  min,
  max,
  positiveNumber,
  futureDate,
};
