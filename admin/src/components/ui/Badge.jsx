// Badge Component - Status and label indicators
import React from 'react';

/**
 * Badge - Status indicator component
 * @param {string} variant - Visual variant: 'default', 'primary', 'success', 'warning', 'danger', 'info'
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} dot - Show status dot
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-secondary-100 text-secondary-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
  };

  // Dot colors
  const dotColors = {
    default: 'bg-secondary-500',
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-primary-500',
    accent: 'bg-accent-500',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
