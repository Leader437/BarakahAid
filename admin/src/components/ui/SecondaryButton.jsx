/*
 * Secondary Button with animated effect (Ported from Client)
*/
import React from 'react';

const SecondaryButton = ({
    children,
    onClick,
    disabled = false,
    type = 'button',
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`secondary-animated-button ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
