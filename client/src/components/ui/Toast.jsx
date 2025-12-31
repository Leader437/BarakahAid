import React, { createContext, useContext, useState, useCallback } from 'react';
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: <HiCheckCircle className="w-5 h-5 text-success-500" />,
    error: <HiXCircle className="w-5 h-5 text-error-500" />,
    warning: <HiExclamation className="w-5 h-5 text-warning-500" />,
    info: <HiInformationCircle className="w-5 h-5 text-primary-500" />,
  };

  const bgColors = {
    success: 'bg-success-50 border-success-200',
    error: 'bg-error-50 border-error-200',
    warning: 'bg-warning-50 border-warning-200',
    info: 'bg-primary-50 border-primary-200',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg ${bgColors[toast.type]} animate-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-secondary-900">{toast.title}</p>
        )}
        <p className="text-sm text-secondary-700">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 transition-colors rounded hover:bg-secondary-200"
      >
        <HiX className="w-4 h-4 text-secondary-500" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, title };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, title = '') => addToast('success', message, title),
    error: (message, title = '') => addToast('error', message, title),
    warning: (message, title = '') => addToast('warning', message, title),
    info: (message, title = '') => addToast('info', message, title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed z-50 flex flex-col gap-2 top-4 right-4 max-w-sm">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
