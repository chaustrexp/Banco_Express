import React from 'react';
import { useBank } from '../../context/BankContext';

const BalanceCards = () => {
  const { state } = useBank();

  // Calculate totals from accounts
  const totalSavings = Object.values(state.accounts)
    .filter(account => account.tipo === 'Ahorros')
    .reduce((sum, account) => sum + account.saldo, 0);

  const totalCurrent = Object.values(state.accounts)
    .filter(account => account.tipo === 'Corriente')
    .reduce((sum, account) => sum + account.saldo, 0);

  const totalBusiness = Object.values(state.accounts)
    .filter(account => account.tipo === 'Empresarial')
    .reduce((sum, account) => sum + account.saldo, 0);

  const totalCredits = Object.values(state.credits)
    .filter(credit => credit.estado === 'Activo')
    .reduce((sum, credit) => sum + credit.saldo, 0);

  const balanceCards = [
    {
      title: 'Cuentas de Ahorros',
      amount: totalSavings,
      icon: 'fas fa-piggy-bank',
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20',
      change: '+5.2%',
      changeColor: 'text-success-600'
    },
    {
      title: 'Cuentas Corrientes',
      amount: totalCurrent,
      icon: 'fas fa-credit-card',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-gradient-to-br from-primary-50 to-accent-100 dark:from-primary-900/20 dark:to-accent-800/20',
      change: '+2.8%',
      changeColor: 'text-success-600'
    },
    {
      title: 'Cuentas Empresariales',
      amount: totalBusiness,
      icon: 'fas fa-building',
      color: 'text-secondary-600 dark:text-secondary-400',
      bgColor: 'bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20',
      change: '+8.1%',
      changeColor: 'text-success-600'
    },
    {
      title: 'Créditos Activos',
      amount: totalCredits,
      icon: 'fas fa-hand-holding-usd',
      color: 'text-accent-600 dark:text-accent-400',
      bgColor: 'bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20',
      change: '-1.5%',
      changeColor: 'text-danger-600'
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
              ${(totalSavings + totalCurrent + totalBusiness).toLocaleString('es-CO')}
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