import React from 'react';
import { useBank } from '../../context/BankContext';

const KPICards = () => {
  const { state } = useBank();

  const kpiData = [
    {
      title: 'Total Depósitos',
      value: state.kpis.totalDeposits,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'fas fa-arrow-down',
      color: 'success',
      bgColor: 'bg-gradient-to-br from-success-500 to-success-600'
    },
    {
      title: 'Total Retiros',
      value: state.kpis.totalWithdrawals,
      change: '-3.2%',
      changeType: 'negative',
      icon: 'fas fa-arrow-up',
      color: 'warning',
      bgColor: 'bg-gradient-to-br from-danger-500 to-danger-600'
    },
    {
      title: 'Transacciones',
      value: state.kpis.totalTransactions,
      change: '+8.7%',
      changeType: 'positive',
      icon: 'fas fa-exchange-alt',
      color: 'primary',
      bgColor: 'bg-gradient-to-br from-primary-500 to-accent-600'
    },
    {
      title: 'Clientes Atendidos',
      value: state.kpis.clientsAttended,
      change: '+15.3%',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: 'secondary',
      bgColor: 'bg-gradient-to-br from-secondary-500 to-secondary-600'
    }
  ];

  const formatValue = (value, isAmount = false) => {
    if (isAmount) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString('es-CO');
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="card card-hover p-3 xs:p-4 sm:p-6 transition-all duration-200"
        >
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
            {/* Icon */}
            <div className={`w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 ${kpi.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`${kpi.icon} text-sm xs:text-lg sm:text-xl`}></i>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                {kpi.title}
              </h3>
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2 truncate">
                {formatValue(kpi.value, index < 2)}
              </div>
              <div className={`flex items-center gap-1 text-xs xs:text-sm font-medium ${
                kpi.changeType === 'positive' 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                <i className={`fas fa-arrow-${kpi.changeType === 'positive' ? 'up' : 'down'} text-xs`}></i>
                <span>{kpi.change}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;