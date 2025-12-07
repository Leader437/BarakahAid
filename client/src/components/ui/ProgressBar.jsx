// Progress Bar Component
import React from 'react';

/**
 * Progress bar component for showing completion percentage
 */
const ProgressBar = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const colorStyles = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
  };
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-secondary-700">
            {label || `${percentage}%`}
          </span>
          <span className="text-sm text-secondary-600">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-secondary-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${colorStyles[color]} ${sizeStyles[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
