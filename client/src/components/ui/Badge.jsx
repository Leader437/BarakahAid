// Reusable Badge Component
import React from 'react';

/**
 * Badge component for status indicators and labels
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';
  
  const variantStyles = {
    default: 'bg-secondary-100 text-secondary-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-primary-50 text-primary-600',
    // Status-specific variants
    pending: 'bg-warning-100 text-warning-700',
    approved: 'bg-success-100 text-success-700',
    active: 'bg-primary-100 text-primary-700',
    fulfilled: 'bg-success-100 text-success-800',
    rejected: 'bg-danger-100 text-danger-700',
    expired: 'bg-secondary-100 text-secondary-700',
    completed: 'bg-success-100 text-success-700',
    failed: 'bg-danger-100 text-danger-700',
    processing: 'bg-primary-100 text-primary-700',
    verified: 'bg-success-100 text-success-700',
    cancelled: 'bg-secondary-100 text-secondary-700',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
