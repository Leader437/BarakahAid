/*
 * Primary Button with animated hover effect
 * @param {string} buttonType - 'main' (default, green on white) or 'secondary' (white on green backgrounds)
 * Uses the main green theme color (#1e8449)
*/

const PrimaryButton = ({
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
      className={`primary-animated-button ${typeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
