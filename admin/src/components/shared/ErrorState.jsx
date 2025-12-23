// Error State Component
import React from 'react';
import Button from '../ui/Button';

/**
 * Error state component for displaying errors
 */
const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error. Please try again.',
  action,
  actionLabel = 'Try Again',
  showIcon = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {showIcon && (
        <div className="w-16 h-16 mb-4 text-danger-400">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-secondary-600 max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
