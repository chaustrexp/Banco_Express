import apiFetch from '../../utils/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const CustomerAccounts = ({ onNavigate }) => {
  const { user } = useAuth();
  const { actions } = useBank();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const clientRes = await apiFetch(`http://localhost:5001/api/clients/email/${user.email}`);
        if (!clientRes.ok) throw new Error('Cliente no encontrado');
        const client = await clientRes.json();
        
        const accRes = await apiFetch(`http://localhost:5001/api/accounts/client/${client.id}`);
        if (!accRes.ok) throw new Error('Error al cargar cuentas');
        
        setAccounts(await accRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchAccounts();
    } else {
      setError("Tu sesión debe ser actualizada. Por favor, cierra sesión y vuelve a entrar.");
      setLoading(false);
    }
  }, [user]);

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'Ahorros': return 'fas fa-piggy-bank text-green-600';
      case 'Corriente': return 'fas fa-credit-card text-blue-600';
      case 'Empresarial': return 'fas fa-building text-purple-600';
      default: return 'fas fa-university text-gray-600';
    }
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Activa': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Bloqueada': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Cerrada': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', icon: 'fas fa-home' }, { label: 'Mis Cuentas', active: true }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Cuentas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus productos financieros</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <i className="fas fa-wallet text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <p className="text-gray-500 dark:text-gray-400">No tienes cuentas activas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(account => (
            <div key={account.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(account.estado)}`}>
                  {account.estado}
                </span>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <i className={`${getTypeIcon(account.tipo)} text-xl`}></i>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Cuenta de {account.tipo}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">
                  {account.numero.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Disponible</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    ${parseFloat(account.saldo).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex gap-2">
                <button 
                  onClick={() => onNavigate && onNavigate('mi-resumen')}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Ver Extractos
                </button>
                <div className="relative dropdown-container">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === account.id ? null : account.id)}
                    className="px-4 h-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                  
                  {activeMenu === account.id && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 animate-fade-in">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(account.numero);
                          actions.showToast('Número de cuenta copiado', 'success');
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy w-5 text-center mr-2 text-gray-400"></i>
                        Copiar Número
                      </button>
                      <button 
                        onClick={() => {
                          setActiveMenu(null);
                          if (onNavigate) onNavigate('transferencias');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-exchange-alt w-5 text-center mr-2 text-primary-500"></i>
                        Transferir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerAccounts;
