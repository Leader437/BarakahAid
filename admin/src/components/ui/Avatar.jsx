// Avatar Component
import React from 'react';
import { getInitials } from '../../utils/helpers';

/**
 * Avatar component for user profile pictures
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };
  
  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };
  
  const initials = name ? getInitials(name) : alt ? getInitials(alt) : '?';
  
  return (
    <div
      className={`flex items-center justify-center bg-primary-100 text-primary-700 font-semibold overflow-hidden ${sizeStyles[size]} ${shapeStyles[shape]} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
