import React from 'react';

const BalanceCards = ({ stats }) => {
  const getBalanceData = (type) => {
    const found = stats?.balancesByType?.find(b => b.type === type);
    return {
      total: found ? parseFloat(found.total) : 0,
      change: found && found.monthly_change !== null ? parseFloat(found.monthly_change) : 0
    };
  };

  const savingsData = getBalanceData('Ahorros');
  const currentData = getBalanceData('Corriente');
  const totalBalance = savingsData.total + currentData.total;

  const balanceCards = [
    {
      title: 'Cuentas de Ahorros',
      amount: savingsData.total,
      icon: 'fas fa-piggy-bank',
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20',
      change: `${savingsData.change >= 0 ? '+' : ''}${savingsData.change.toFixed(1)}%`,
      changeColor: savingsData.change >= 0 ? 'text-success-600' : 'text-danger-600'
    },
    {
      title: 'Cuentas Corrientes',
      amount: currentData.total,
      icon: 'fas fa-credit-card',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-gradient-to-br from-primary-50 to-accent-100 dark:from-primary-900/20 dark:to-accent-800/20',
      change: `${currentData.change >= 0 ? '+' : ''}${currentData.change.toFixed(1)}%`,
      changeColor: currentData.change >= 0 ? 'text-success-600' : 'text-danger-600'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resumen de Saldos
      </h3>
      
      {balanceCards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <i className={`${card.icon} ${card.color} text-lg`}></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${card.amount.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${card.changeColor}`}>
                {card.change}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">vs mes anterior</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Total Balance Summary */}
      <div className="bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 rounded-lg p-4 text-white mt-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Balance Total</p>
            <p className="text-2xl font-bold">
              ${totalBalance.toLocaleString('es-CO')}
            </p>
          </div>
          <div className="text-right">
            <i className="fas fa-chart-line text-2xl opacity-80"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;