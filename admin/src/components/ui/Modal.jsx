// Modal Component - Dialog overlay
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal - Dialog overlay component
 * @param {boolean} isOpen - Modal visibility
 * @param {Function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl', 'full'
 * @param {React.ReactNode} footer - Footer content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  className = '',
}) => {
  // Handle ESC key
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEsc) {
      onClose?.();
    }
  }, [onClose, closeOnEsc]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-xl shadow-xl w-full
            transform transition-all
            ${sizeClasses[size] || sizeClasses.md}
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render in portal
  return createPortal(modalContent, document.body);
};

export default Modal;
