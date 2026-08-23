import apiFetch from '../../utils/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const CustomerRecharge = () => {
  const { user } = useAuth();
  const { actions } = useBank();
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    cuenta: '',
    monto: '',
    descripcion: 'Recarga en efectivo'
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
              setFormData(prev => ({ ...prev, cuenta: accs[0].numero }));
            }
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
    
    if (!formData.cuenta || !formData.monto) {
      actions.showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Llamar al endpoint estándar de creación de transacciones
      const res = await apiFetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuenta: formData.cuenta,
          tipo: 'Depósito',
          monto: formData.monto,
          descripcion: formData.descripcion
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        actions.showModalNotification(`Recarga de $${parseFloat(formData.monto).toLocaleString('es-CO')} exitosa a la cuenta ${formData.cuenta}`, 'success');
        actions.addNotification(`Recarga de $${parseFloat(formData.monto).toLocaleString('es-CO')} exitosa a la cuenta ${formData.cuenta}`, 'success');
        
        // Refrescar el componente limpiando el monto
        setFormData(prev => ({ ...prev, monto: '' }));
      } else {
        actions.showToast(data.message || 'Error al procesar la recarga', 'error');
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
      <Breadcrumbs items={[{ label: 'Inicio', icon: 'fas fa-home' }, { label: 'Recargar Cuenta', active: true }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recargar Cuenta</h1>
          <p className="text-gray-600 dark:text-gray-400">Ingresa dinero en efectivo a tus cuentas bancarias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharge Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fas fa-money-bill-wave text-success-500"></i>
                Simular Ingreso de Efectivo
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
                No tienes cuentas activas para realizar recargas.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecciona tu Cuenta
                  </label>
                  <div className="relative">
                    <select
                      value={formData.cuenta}
                      onChange={(e) => setFormData({...formData, cuenta: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none transition-colors"
                      required
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.numero}>
                          {acc.tipo} - {acc.numero.slice(-4)} (Saldo actual: ${parseFloat(acc.saldo).toLocaleString('es-CO')})
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-wallet absolute left-4 top-3.5 text-gray-400"></i>
                    <i className="fas fa-chevron-down absolute right-4 top-4 text-gray-400 text-xs"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monto a Recargar (Efectivo)
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
                      min="1000"
                      className="w-full pl-8 pr-4 py-3 text-lg font-semibold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Monto mínimo: $1,000 COP
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-colors"
                    />
                    <i className="fas fa-comment-alt absolute left-4 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-success-600 hover:bg-success-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><i className="fas fa-spinner fa-spin"></i> Procesando...</>
                    ) : (
                      <><i className="fas fa-hand-holding-usd"></i> Recargar Cuenta</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-success-500 to-emerald-700 rounded-xl shadow-sm p-6 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-bolt text-xl"></i>
            </div>
            <h3 className="font-semibold text-lg mb-2">Recarga Inmediata</h3>
            <p className="text-success-50 text-sm">
              El dinero en efectivo depositado a través de este módulo se reflejará instantáneamente en tu saldo disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRecharge;
