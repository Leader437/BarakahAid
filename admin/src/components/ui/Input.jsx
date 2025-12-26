// Input Component - Form input with label and error
import React from 'react';

/**
 * Input - Form input component
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} hint - Hint text
 * @param {string} type - Input type
 */
const Input = React.forwardRef(({
  label,
  error,
  hint,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
    ${error
      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
      : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
    }
    ${inputClassName}
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {hint && !error && (
        <p className="mt-1.5 text-sm text-secondary-500">{hint}</p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-danger-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Textarea Component
 */
export const Textarea = React.forwardRef(({
  label,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  const textareaClasses = `
    w-full px-4 py-2 border rounded-lg resize-none
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
    ${error
      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
      : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
    }
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />

      {hint && !error && (
        <p className="mt-1.5 text-sm text-secondary-500">{hint}</p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/**
 * Select Component
 */
export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-4 py-2 border rounded-lg appearance-none bg-white
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
    ${error
      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
      : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
    }
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;
