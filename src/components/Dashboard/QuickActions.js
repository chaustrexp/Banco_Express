import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';

const QuickActions = () => {
  const { state, actions } = useBank();
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [formData, setFormData] = useState({
    cliente: '',
    cuenta: '',
    monto: '',
    descripcion: ''
  });

  const quickActions = [
    {
      id: 'deposito',
      title: 'Depósito Rápido',
      icon: 'fas fa-plus-circle',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    {
      id: 'retiro',
      title: 'Retiro Rápido',
      icon: 'fas fa-minus-circle',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
    },
    {
      id: 'transferencia',
      title: 'Transferencia',
      icon: 'fas fa-exchange-alt',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    {
      id: 'pago',
      title: 'Pago de Servicios',
      icon: 'fas fa-credit-card',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30'
    }
  ];

  const handleActionClick = (actionId) => {
    setActionType(actionId);
    setShowModal(true);
    setFormData({
      cliente: '',
      cuenta: '',
      monto: '',
      descripcion: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.cuenta || !formData.monto) {
      actions.showToast('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: actionType.charAt(0).toUpperCase() + actionType.slice(1),
      cliente: formData.cliente,
      cuenta: formData.cuenta,
      monto: parseInt(formData.monto),
      estado: 'Completado',
      descripcion: formData.descripcion
    };

    actions.addTransaction(transaction);
    actions.showToast(`${transaction.tipo} procesado exitosamente`, 'success');
    setShowModal(false);
  };

  const getClients = () => {
    return Object.values(state.clients).map(client => ({
      value: client.nombre,
      label: `${client.nombre} (${client.cedula})`
    }));
  };

  const getAccounts = () => {
    return Object.values(state.accounts).map(account => ({
      value: account.numero,
      label: `${account.numero} - ${account.cliente} (${account.tipo})`
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acciones Rápidas
      </h3>
      
      <div className="space-y-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className={`w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${action.bgColor} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                <i className={`${action.icon} ${action.color} text-lg`}></i>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {action.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Procesar {action.id}
                </p>
              </div>
              <div className="ml-auto">
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Estadísticas del Día</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Transacciones</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {state.kpis.totalTransactions}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Clientes Atendidos</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {state.kpis.clientsAttended}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Depósitos</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              ${state.kpis.totalDeposits.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Rápido
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cliente *
                  </label>
                  <select
                    value={formData.cliente}
                    onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {getClients().map((client) => (
                      <option key={client.value} value={client.value}>
                        {client.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cuenta *
                  </label>
                  <select
                    value={formData.cuenta}
                    onChange={(e) => setFormData({...formData, cuenta: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar cuenta</option>
                    {getAccounts().map((account) => (
                      <option key={account.value} value={account.value}>
                        {account.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monto *
                  </label>
                  <input
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                    placeholder="Descripción opcional..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Procesar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;