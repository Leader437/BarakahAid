// Empty State Component
import React from 'react';

/**
 * EmptyState - Display when no data is available
 * @param {string} title - Main title
 * @param {string} description - Description text
 * @param {React.ReactNode} icon - Custom icon (optional)
 * @param {React.ReactNode} action - Action button (optional)
 * @param {string} variant - Visual variant: 'default', 'search', 'error'
 */
const EmptyState = ({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  icon,
  action,
  variant = 'default',
  className = '',
}) => {
  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return (
          <svg className="w-16 h-16 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-16 h-16 text-danger-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'empty':
        return (
          <svg className="w-16 h-16 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        {icon || getDefaultIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary-500 text-center max-w-sm mb-6">
        {description}
      </p>

      {/* Action */}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

// Preset empty states
export const NoSearchResults = ({ query, onClear }) => (
  <EmptyState
    variant="search"
    title="No results found"
    description={`No results match "${query}". Try adjusting your search or filters.`}
    action={
      onClear && (
        <button
          onClick={onClear}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Clear search
        </button>
      )
    }
  />
);

export const NoDataYet = ({ entityName = 'items' }) => (
  <EmptyState
    variant="empty"
    title={`No ${entityName} yet`}
    description={`There are no ${entityName} to display. They will appear here once added.`}
  />
);

export default EmptyState;
