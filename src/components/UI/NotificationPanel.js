import React, { useRef, useEffect } from 'react';
import { useBank } from '../../context/BankContext';

const NotificationPanel = ({ onClose }) => {
  const panelRef = useRef(null);
  const { state } = useBank();
  const notifications = state.notifications || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Helper to get time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'ahora';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'hace unos segundos';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return `hace ${Math.floor(hours / 24)} día${Math.floor(hours / 24) > 1 ? 's' : ''}`;
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-times-circle';
      case 'info':
      default: return 'fas fa-info-circle';
    }
  };

  const getNotificationClasses = (type) => {
    const baseClasses = 'flex items-start gap-3 p-4 border-l-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200';
    switch (type) {
      case 'warning':
        return `${baseClasses} border-warning-500 bg-warning-50 dark:bg-warning-900/10`;
      case 'info':
        return `${baseClasses} border-primary-500 bg-primary-50 dark:bg-primary-900/10`;
      case 'success':
        return `${baseClasses} border-success-500 bg-success-50 dark:bg-success-900/10`;
      default:
        return `${baseClasses} border-gray-300 dark:border-gray-600`;
    }
  };

  const getIconClasses = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning-500';
      case 'info':
        return 'text-primary-500';
      case 'success':
        return 'text-success-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-slide-in-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notificaciones
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={getNotificationClasses(notification.type)}
            >
              <i className={`${getIconForType(notification.type)} ${getIconClasses(notification.type)} mt-0.5`}></i>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getTimeAgo(notification.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fas fa-bell-slash text-2xl mb-2 text-gray-300 dark:text-gray-600"></i>
            <p>No tienes notificaciones recientes</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;