// Loading Spinner Component
import React from 'react';

/**
 * LoadingSpinner - Animated loading indicator
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} color - Color variant: 'primary', 'white', 'secondary' (default: 'primary')
 * @param {string} text - Optional loading text
 * @param {boolean} fullScreen - Show as fullscreen overlay
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text = '',
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
    success: 'border-success-200 border-t-success-600',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          ${colorClasses[color] || colorClasses.primary}
          rounded-full animate-spin
        `}
      />
      {text && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-secondary-500'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * PageLoader - Full page loading state
 */
export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

/**
 * ButtonLoader - Inline button loading spinner
 */
export const ButtonLoader = () => (
  <LoadingSpinner size="sm" color="white" />
);

export default LoadingSpinner;
