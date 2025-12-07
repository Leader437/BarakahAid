// Reusable TextArea Component
import React from 'react';

/**
 * TextArea component for multi-line text input
 */
const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showCount = false,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const textareaClasses = `
    w-full px-4 py-2.5 text-base text-secondary-900 bg-white border rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2 resize-none
    disabled:bg-secondary-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-200' 
      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-200'
    }
    ${className}
  `;

  const currentLength = value ? value.length : 0;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        {...props}
      />
      
      <div className="flex justify-between items-center mt-1.5">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-danger-600">{error}</p>
          )}
          
          {helperText && !error && (
            <p className="text-sm text-secondary-500">{helperText}</p>
          )}
        </div>
        
        {showCount && maxLength && (
          <p className={`text-sm ${currentLength >= maxLength ? 'text-danger-600' : 'text-secondary-500'}`}>
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
