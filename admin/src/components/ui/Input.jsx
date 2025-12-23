// Reusable Input Component
import React from 'react';

/**
 * Input component with label, error, and icon support
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-2.5 text-base text-secondary-900 bg-white border rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2
    disabled:bg-secondary-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-200' 
      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-200'
    }
    ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
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
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
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

export default Input;
