import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const PaymentsSection = () => {
  const { state, actions } = useBank();
  const [activeService, setActiveService] = useState('');
  const [formData, setFormData] = useState({
    cliente: '',
    servicio: '',
    referencia: '',
    monto: '',
    descripcion: ''
  });

  const services = [
    { id: 'energia', name: 'Energía Eléctrica', icon: 'fas fa-bolt', color: 'text-yellow-600' },
    { id: 'agua', name: 'Agua y Alcantarillado', icon: 'fas fa-tint', color: 'text-blue-600' },
    { id: 'gas', name: 'Gas Natural', icon: 'fas fa-fire', color: 'text-orange-600' },
    { id: 'telefono', name: 'Telefonía', icon: 'fas fa-phone', color: 'text-green-600' },
    { id: 'internet', name: 'Internet/TV', icon: 'fas fa-wifi', color: 'text-purple-600' },
    { id: 'impuestos', name: 'Impuestos', icon: 'fas fa-file-invoice-dollar', color: 'text-red-600' }
  ];

  const handleServiceSelect = (serviceId) => {
    setActiveService(serviceId);
    const service = services.find(s => s.id === serviceId);
    setFormData({
      cliente: '',
      servicio: service.name,
      referencia: '',
      monto: '',
      descripcion: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.referencia || !formData.monto) {
      actions.showToast('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const payment = {
      id: `PAY${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente: formData.cliente,
      servicio: formData.servicio,
      referencia: formData.referencia,
      monto: parseInt(formData.monto),
      estado: 'Completado',
      descripcion: formData.descripcion
    };

    actions.addPayment(payment);
    actions.showToast('Pago procesado exitosamente', 'success');
    
    // Reset form
    setFormData({
      cliente: '',
      servicio: formData.servicio,
      referencia: '',
      monto: '',
      descripcion: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs 
        items={[
          { label: 'Inicio', icon: 'fas fa-home' },
          { label: 'Pagos de Servicios', active: true }
        ]} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pagos de Servicios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Procesa pagos de servicios públicos y otros servicios
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seleccionar Servicio
            </h3>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                    activeService === service.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <i className={`${service.icon} ${service.color} text-lg`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pago en línea
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeService ? (
              <>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mr-4">
                    <i className={`${services.find(s => s.id === activeService)?.icon} ${services.find(s => s.id === activeService)?.color} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pago de {services.find(s => s.id === activeService)?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete la información del pago
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {Object.values(state.clients).map((client) => (
                          <option key={client.cedula} value={client.nombre}>
                            {client.nombre} ({client.cedula})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número de Referencia *
                      </label>
                      <input
                        type="text"
                        value={formData.referencia}
                        onChange={(e) => setFormData({...formData, referencia: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Número de factura o referencia"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Monto a Pagar *
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
                      <input
                        type="text"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Descripción opcional"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveService('')}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Procesar Pago
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-credit-card text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Selecciona un Servicio
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Elige el tipo de servicio que deseas pagar desde el panel izquierdo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      {state.payments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pagos Recientes
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {state.payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.servicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${payment.monto.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.fecha}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsSection;