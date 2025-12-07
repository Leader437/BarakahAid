// Form validation rules

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
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain a lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain an uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain a number';
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

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const re = /^[\d\s\-\+\(\)]+$/;
  if (!re.test(phone)) return 'Invalid phone number format';
  if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
  return '';
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) return '';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Validate number
 */
export const validateNumber = (value, fieldName = 'This field') => {
  if (!value) return `${fieldName} is required`;
  if (isNaN(value)) return `${fieldName} must be a number`;
  return '';
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value, fieldName = 'This field') => {
  const numError = validateNumber(value, fieldName);
  if (numError) return numError;
  if (parseFloat(value) <= 0) return `${fieldName} must be greater than 0`;
  return '';
};

/**
 * Validate amount range
 */
export const validateAmountRange = (value, min, max) => {
  const numError = validatePositiveNumber(value, 'Amount');
  if (numError) return numError;
  const num = parseFloat(value);
  if (min && num < min) return `Amount must be at least ${min}`;
  if (max && num > max) return `Amount must not exceed ${max}`;
  return '';
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return `${fieldName} is required`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return `Invalid ${fieldName.toLowerCase()} format`;
  return '';
};

/**
 * Validate future date
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  const d = new Date(date);
  const now = new Date();
  if (d <= now) return `${fieldName} must be in the future`;
  return '';
};

/**
 * Validate file upload
 */
export const validateFile = (file, maxSizeMB = 5, allowedTypes = []) => {
  if (!file) return 'File is required';
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  
  return '';
};
