// Card Component - Flexible container with optional header/body/footer
import React from 'react';

/**
 * Card - Flexible container component
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional classes
 * @param {string} padding - Padding variant: 'none', 'sm', 'md', 'lg'
 */
const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-xl border border-secondary-200 shadow-sm
        ${paddingClasses[padding] || paddingClasses.md}
        ${hover ? 'hover:shadow-md hover:border-secondary-300 transition-all' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header
Card.Header = ({ children, className = '', border = true }) => (
  <div className={`pb-4 ${border ? 'border-b border-secondary-200 mb-4' : ''} ${className}`}>
    {children}
  </div>
);

// Card Body
Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

// Card Footer
Card.Footer = ({ children, className = '', border = true }) => (
  <div className={`pt-4 ${border ? 'border-t border-secondary-200 mt-4' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;
