// Reusable Select Component
import React from 'react';

/**
 * Select dropdown component
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const selectClasses = `
    w-full px-4 py-2.5 text-base text-secondary-900 bg-white border rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2
    disabled:bg-secondary-50 disabled:cursor-not-allowed appearance-none
    ${error 
      ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-200' 
      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-200'
    }
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
