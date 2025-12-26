import React, { useEffect } from 'react';
import { useBank } from '../../context/BankContext';

const Toast = () => {
  const { state, actions } = useBank();

  useEffect(() => {
    state.toasts.forEach(toast => {
      if (toast.id) {
        const timer = setTimeout(() => {
          actions.removeToast(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [state.toasts, actions]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-success-500';
      case 'error':
        return 'fas fa-times-circle text-danger-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning-500';
      case 'info':
      default:
        return 'fas fa-info-circle text-primary-500';
    }
  };

  const getToastClasses = (type) => {
    const baseClasses = 'toast transform transition-all duration-300 translate-x-0 opacity-100';
    switch (type) {
      case 'success':
        return `${baseClasses} toast-success`;
      case 'error':
        return `${baseClasses} toast-error`;
      case 'warning':
        return `${baseClasses} toast-warning`;
      case 'info':
      default:
        return `${baseClasses} toast-info`;
    }
  };

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastClasses(toast.type)}
        >
          <div className="flex items-center gap-3">
            <i className={getToastIcon(toast.type)}></i>
            <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => actions.removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;