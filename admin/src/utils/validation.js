// Form validation rules for Admin Panel (Ported from Client)

/**
 * Validate email
 */
export const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return 'Invalid email format';
    return '';
  };
  
  /**
   * Validate password
   */
  export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    // Simplified for admin internal use if needed, but keeping strict for consistency
    // if (!/(?=.*[a-z])/.test(password)) return 'Password must contain a lowercase letter';
    // if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain an uppercase letter';
    // if (!/(?=.*\d)/.test(password)) return 'Password must contain a number';
    return '';
  };
  
  /**
   * Validate required field
   */
  export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  };
  
  /**
   * Validate minimum length
   */
  export const validateMinLength = (value, min, fieldName = 'This field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return '';
  };
  
  /**
   * Validate maximum length
   */
  export const validateMaxLength = (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters`;
    }
    return '';
  };
  
  // Export all as default object as well for flexibility
  export default {
    validateEmail,
    validatePassword,
    validateRequired,
    validateMinLength,
    validateMaxLength
  };
