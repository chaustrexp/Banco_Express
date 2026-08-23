import apiFetch from '../../utils/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const CustomerDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [clientData, setClientData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Fetch client by email
        const clientRes = await apiFetch(`http://localhost:5001/api/clients/email/${user.email}`);
        if (clientRes.ok) {
          const client = await clientRes.json();
          setClientData(client);
          
          // Fetch accounts and transactions
          const [accRes, txRes] = await Promise.all([
            apiFetch(`http://localhost:5001/api/accounts/client/${client.id}`),
            apiFetch(`http://localhost:5001/api/transactions/client/${client.id}`)
          ]);
          
          if (accRes.ok) setAccounts(await accRes.json());
          if (txRes.ok) setTransactions(await txRes.json());
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  if (!clientData) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-circle text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <p className="text-gray-500 dark:text-gray-400">
          {!user?.email 
            ? "Tu sesión debe ser actualizada. Por favor, cierra sesión y vuelve a entrar." 
            : "No se encontró información de cliente vinculada a este usuario."}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {!user?.email ? "" : "Por favor, contacta a soporte para vincular tu cuenta."}
        </p>
      </div>
    );
  }

  const totalBalance = accounts.reduce((acc, curr) => acc + parseFloat(curr.saldo), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', icon: 'fas fa-home' }, { label: 'Mi Resumen', active: true }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hola, {clientData.nombre.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aquí tienes un resumen de tus productos financieros
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white col-span-1 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-primary-100 text-sm font-medium">Saldo Total Disponible</p>
              <h2 className="text-4xl font-bold mt-1">${totalBalance.toLocaleString('es-CO')}</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <i className="fas fa-wallet text-xl"></i>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 px-4 py-2 rounded-lg flex-1 backdrop-blur-sm">
              <p className="text-xs text-primary-200">Cuentas Activas</p>
              <p className="font-semibold">{accounts.length}</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg flex-1 backdrop-blur-sm">
              <p className="text-xs text-primary-200">Último movimiento</p>
              <p className="font-semibold">{transactions.length > 0 ? transactions[0].fecha : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Acciones Rápidas</h3>
          <button 
            onClick={() => onNavigate && onNavigate('transferencias')}
            className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-exchange-alt text-primary-500"></i>
              <span>Transferir Dinero</span>
            </div>
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('pagar-servicios')}
            className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-file-invoice-dollar text-green-500"></i>
              <span>Pagar Servicios</span>
            </div>
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Movimientos Recientes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.slice(0, 5).length > 0 ? transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.tipo === 'Depósito' || tx.tipo === 'Transferencia' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <i className={`fas ${tx.tipo === 'Depósito' ? 'fa-arrow-down' : tx.tipo === 'Retiro' ? 'fa-arrow-up' : 'fa-exchange-alt'}`}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{tx.descripcion || tx.tipo}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tx.fecha} • Cuenta: *{tx.cuenta.slice(-4)}</p>
                </div>
              </div>
              <div className={`font-semibold ${tx.tipo === 'Depósito' || tx.tipo === 'Transferencia' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {tx.tipo === 'Depósito' || tx.tipo === 'Transferencia' ? '+' : '-'}${parseFloat(tx.monto).toLocaleString('es-CO')}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No hay movimientos recientes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
