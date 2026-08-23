import apiFetch from '../../utils/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const CustomerTransfers = () => {
  const { user } = useAuth();
  const { actions } = useBank();
  
  const [accounts, setAccounts] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    monto: '',
    descripcion: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const clientRes = await apiFetch(`http://localhost:5001/api/clients/email/${user.email}`);
        if (clientRes.ok) {
          const client = await clientRes.json();
          const accRes = await apiFetch(`http://localhost:5001/api/accounts/client/${client.id}`);
          if (accRes.ok) {
            const accs = await accRes.json();
            setAccounts(accs.filter(a => a.estado === 'Activa'));
            if (accs.length > 0) {
              setFormData(prev => ({ ...prev, cuentaOrigen: accs[0].numero }));
            }
          }
          
          const txRes = await apiFetch(`http://localhost:5001/api/transactions/client/${client.id}`);
          if (txRes.ok) {
            const txs = await txRes.json();
            const transfersOnly = txs.filter(t => t.tipo === 'Transferencia' || (t.tipo === 'Depósito' && t.descripcion.includes('Recibido de')));
            setRecentTransfers(transfersOnly);
          }
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchAccounts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!formData.cuentaOrigen || !formData.cuentaDestino || !formData.monto) {
      actions.showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (formData.cuentaOrigen === formData.cuentaDestino) {
      actions.showToast('La cuenta origen y destino no pueden ser la misma', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create transfer transaction calling the new transfer endpoint
      const res = await apiFetch('http://localhost:5001/api/transactions/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuentaOrigen: formData.cuentaOrigen,
          cuentaDestino: formData.cuentaDestino,
          monto: formData.monto,
          descripcion: formData.descripcion
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        actions.showToast('Transferencia enviada con éxito', 'success');
        actions.addNotification(`Transferencia de $${parseFloat(formData.monto).toLocaleString('es-CO')} enviada a la cuenta ${formData.cuentaDestino}`, 'success');
        
        const newTx = {
          id: `TR${Date.now()}`,
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'Transferencia',
          descripcion: `Enviado a ${data.destClientName} (${formData.cuentaDestino}) - ${formData.descripcion || 'Transferencia'}`,
          monto: formData.monto
        };
        setRecentTransfers([newTx, ...recentTransfers]);
        
        setFormData(prev => ({ ...prev, cuentaDestino: '', monto: '', descripcion: '' }));
      } else {
        actions.showToast(data.message || 'Error al procesar transferencia', 'error');
      }
    } catch (error) {
      console.error(error);
      actions.showToast('Error de conexión', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', icon: 'fas fa-home' }, { label: 'Transferencias', active: true }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transferencias</h1>
          <p className="text-gray-600 dark:text-gray-400">Envía dinero a otras cuentas de forma segura</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fas fa-paper-plane text-primary-500"></i>
                Nueva Transferencia
              </h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>
            ) : !user?.email ? (
              <div className="p-8 text-center text-red-500 dark:text-red-400">
                Tu sesión debe ser actualizada. Por favor, cierra sesión y vuelve a entrar.
              </div>
            ) : accounts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No tienes cuentas activas para realizar transferencias.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cuenta Origen
                  </label>
                  <div className="relative">
                    <select
                      value={formData.cuentaOrigen}
                      onChange={(e) => setFormData({...formData, cuentaOrigen: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none transition-colors"
                      required
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.numero}>
                          {acc.tipo} - {acc.numero.slice(-4)} (Saldo: ${parseFloat(acc.saldo).toLocaleString('es-CO')})
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-wallet absolute left-4 top-3.5 text-gray-400"></i>
                    <i className="fas fa-chevron-down absolute right-4 top-4 text-gray-400 text-xs"></i>
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 text-gray-400">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cuenta Destino
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cuentaDestino}
                      onChange={(e) => setFormData({...formData, cuentaDestino: e.target.value})}
                      placeholder="Número de cuenta de Banco Exprés"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                    <i className="fas fa-university absolute left-4 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monto a Transferir
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      value={formData.monto}
                      onChange={(e) => setFormData({...formData, monto: e.target.value})}
                      placeholder="0.00"
                      min="1"
                      className="w-full pl-8 pr-4 py-3 text-lg font-semibold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Concepto (Opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Ej: Pago arriendo"
                      maxLength={50}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-colors"
                    />
                    <i className="fas fa-comment-alt absolute left-4 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><i className="fas fa-spinner fa-spin"></i> Procesando...</>
                    ) : (
                      <><i className="fas fa-paper-plane"></i> Enviar Dinero</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-sm p-6 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-shield-alt text-xl"></i>
            </div>
            <h3 className="font-semibold text-lg mb-2">Transferencias Seguras</h3>
            <p className="text-blue-100 text-sm">
              Tus transferencias están protegidas por encriptación de extremo a extremo. Los fondos se envían de forma inmediata.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Límites Diarios</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Transferencias a terceros</span>
                  <span className="font-medium text-gray-900 dark:text-white">$10.000.000</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Pago de servicios</span>
                  <span className="font-medium text-gray-900 dark:text-white">$3.000.000</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transfers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transferencias Recientes</h3>
        </div>
        {recentTransfers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detalle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentTransfers.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{tx.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.tipo === 'Transferencia' ? (
                        <span className="text-red-600 dark:text-red-400 font-medium"><i className="fas fa-arrow-up mr-1"></i> Enviado</span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 font-medium"><i className="fas fa-arrow-down mr-1"></i> Recibido</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{tx.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">${parseFloat(tx.monto).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aún no has realizado ni recibido transferencias.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTransfers;
