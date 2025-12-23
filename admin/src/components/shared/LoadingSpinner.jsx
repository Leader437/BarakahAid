// Loading Spinner Component
import React from 'react';

/**
 * Loading spinner component
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  centered = false,
  fullScreen = false,
  message,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };
  
  const colorStyles = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-secondary-600 border-t-transparent',
    success: 'border-success-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };
  
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeStyles[size]} ${colorStyles[color]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-secondary-600">{message}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinner}
      </div>
    );
  }
  
  if (centered) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingSpinner;
