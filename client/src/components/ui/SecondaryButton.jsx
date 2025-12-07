// Secondary Button Component with Animation
import React from 'react';

/**
 * Secondary Button with animated hover effect (outline style)
 * @param {string} buttonType - 'main' (default, green outline) or 'secondary' (white outline on green backgrounds)
 * Uses the green theme color (#1e8449)
 */
const SecondaryButton = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  buttonType = 'main',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const typeClass = buttonType === 'secondary' ? 'secondary-type' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`secondary-animated-button ${typeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
