// Reusable Card Component
import React from 'react';

/**
 * Card component for content containers
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-card border border-secondary-200 transition-all duration-300';
  
  const variantStyles = {
    default: 'shadow-card',
    elevated: 'shadow-lg',
    flat: 'shadow-none',
  };
  
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const hoverStyles = hoverable ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header sub-component
 */
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Body sub-component
 */
Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * Card Footer sub-component
 */
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-secondary-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
