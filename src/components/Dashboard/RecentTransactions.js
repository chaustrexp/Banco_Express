import React from 'react';

const RecentTransactions = ({ stats, onNavigate }) => {
  // Get recent transactions from real backend
  const recentTransactions = stats?.recentTransactions || [];

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
      case 'Depósito':
        return 'fas fa-arrow-down text-green-600';
      case 'Retiro':
        return 'fas fa-arrow-up text-red-600';
      case 'Transferencia':
        return 'fas fa-exchange-alt text-blue-600';
      case 'Pago':
        return 'fas fa-credit-card text-purple-600';
      default:
        return 'fas fa-circle text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transacciones Recientes
        </h3>
        <button 
          onClick={() => onNavigate && onNavigate('transacciones')}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <i className={getTransactionIcon(transaction.type)}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.client_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${parseFloat(transaction.amount).toLocaleString('es-CO')}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`}>
                  Completado
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-receipt text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400">No hay transacciones recientes</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {recentTransactions.filter(t => t.type === 'Depósito').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Depósitos recientes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {recentTransactions.filter(t => t.type === 'Retiro').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Retiros recientes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {recentTransactions.filter(t => t.type === 'Transferencia').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Transferencias recientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;