// Empty State Component
import React from 'react';
import Button from '../ui/Button';

/**
 * Empty state component for when no data is available
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 mb-4 text-secondary-300">
          <Icon className="w-full h-full" />
        </div>
      )}
      
      {!Icon && (
        <div className="w-16 h-16 mb-4 flex items-center justify-center">
          <svg className="w-full h-full text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title || 'No data available'}
      </h3>
      
      {description && (
        <p className="text-secondary-600 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
