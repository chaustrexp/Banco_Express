import React from 'react';
import { useBank } from '../../context/BankContext';

const NotificationModal = () => {
  const { state, actions } = useBank();
  
  // We'll show the most recent modal notification
  const currentModal = state.modalNotifications && state.modalNotifications.length > 0 
    ? state.modalNotifications[0] 
    : null;

  if (!currentModal) return null;

  const handleClose = () => {
    actions.removeModalNotification(currentModal.id);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-success-500';
      case 'error': return 'fas fa-exclamation-circle text-danger-500';
      case 'warning': return 'fas fa-exclamation-triangle text-warning-500';
      default: return 'fas fa-info-circle text-primary-500';
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case 'success': return '¡Operación Exitosa!';
      case 'error': return 'Error en la Operación';
      case 'warning': return 'Advertencia';
      default: return 'Nueva Notificación';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden transform transition-all scale-100">
        
        {/* Header Decorativo */}
        <div className={`h-2 w-full ${
          currentModal.type === 'success' ? 'bg-success-500' :
          currentModal.type === 'error' ? 'bg-danger-500' :
          currentModal.type === 'warning' ? 'bg-warning-500' : 'bg-primary-500'
        }`}></div>
        
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Ícono */}
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-4">
              <i className={`${getIcon(currentModal.type)} text-4xl`}></i>
            </div>
            
            {/* Título */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {getTitle(currentModal.type)}
            </h3>
            
            {/* Mensaje */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm xs:text-base">
              {currentModal.message}
            </p>
            
            {/* Botón */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
