/**
 * CONTEXTO BANCARIO - BANCO EXPRÉS
 * =================================
 * 
 * Maneja todos los datos y operaciones bancarias de la aplicación.
 * Incluye gestión de clientes, cuentas, créditos, transacciones y KPIs.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 * 
 * CARACTERÍSTICAS:
 * - Gestión completa de clientes bancarios
 * - Administración de cuentas (ahorros, corriente, empresarial)
 * - Control de créditos y préstamos
 * - Registro de transacciones
 * - Sistema de notificaciones (toasts)
 * - KPIs y métricas bancarias
 * - Operaciones CRUD para todas las entidades
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// Crear el contexto bancario
const BankContext = createContext();

/**
 * ESTADO INICIAL DEL SISTEMA BANCARIO
 * ===================================
 * 
 * Define todos los datos iniciales del sistema bancario incluyendo
 * clientes, cuentas, créditos, transacciones y métricas.
 */
const initialState = {
  
  /**
   * CLIENTES DEL BANCO
   * ==================
   * 
   * Base de datos de clientes con información personal y financiera.
   * Cada cliente tiene cédula única como identificador.
   */
  clients: {
    '12345678': { 
      cedula: '12345678', 
      nombre: 'Juan Pérez', 
      email: 'juan.perez@email.com', 
      telefono: '300-123-4567', 
      estado: 'Activo', // Estados: Activo, Inactivo, VIP, Bloqueado
      fechaRegistro: '2023-01-15', 
      saldo: 2500000 // Saldo total en COP
    },
    '87654321': { 
      cedula: '87654321', 
      nombre: 'María García', 
      email: 'maria.garcia@email.com', 
      telefono: '300-987-6543', 
      estado: 'VIP', // Cliente VIP con beneficios especiales
      fechaRegistro: '2022-08-22', 
      saldo: 5750000 
    },
    '11223344': { 
      cedula: '11223344', 
      nombre: 'Carlos López', 
      email: 'carlos.lopez@email.com', 
      telefono: '300-112-2334', 
      estado: 'Activo', 
      fechaRegistro: '2023-03-10', 
      saldo: 12300000 
    },
    '44332211': { 
      cedula: '44332211', 
      nombre: 'Ana Rodríguez', 
      email: 'ana.rodriguez@email.com', 
      telefono: '300-443-3221', 
      estado: 'Inactivo', // Cliente inactivo
      fechaRegistro: '2021-12-05', 
      saldo: 890000 
    },
    '55667788': { 
      cedula: '55667788', 
      nombre: 'Luis Martínez', 
      email: 'luis.martinez@email.com', 
      telefono: '300-556-6778', 
      estado: 'Activo', 
      fechaRegistro: '2023-02-18', 
      saldo: 3200000 
    }
  },
  accounts: {
    '1001234567': { 
      numero: '1001234567', 
      cliente: 'Juan Pérez', 
      cedula: '12345678',
      tipo: 'Ahorros', 
      saldo: 2500000, 
      estado: 'Activa', 
      fechaApertura: '2023-01-15' 
    },
    '1007654321': { 
      numero: '1007654321', 
      cliente: 'María García', 
      cedula: '87654321',
      tipo: 'Corriente', 
      saldo: 5750000, 
      estado: 'Activa', 
      fechaApertura: '2022-08-22' 
    },
    '1001122334': { 
      numero: '1001122334', 
      cliente: 'Carlos López', 
      cedula: '11223344',
      tipo: 'Empresarial', 
      saldo: 12300000, 
      estado: 'Activa', 
      fechaApertura: '2023-03-10' 
    },
    '1004433221': { 
      numero: '1004433221', 
      cliente: 'Ana Rodríguez', 
      cedula: '44332211',
      tipo: 'Ahorros', 
      saldo: 890000, 
      estado: 'Bloqueada', 
      fechaApertura: '2021-12-05' 
    },
    '1005566778': { 
      numero: '1005566778', 
      cliente: 'Luis Martínez', 
      cedula: '55667788',
      tipo: 'Corriente', 
      saldo: 3200000, 
      estado: 'Activa', 
      fechaApertura: '2023-02-18' 
    }
  },
  credits: {
    'CRE001': { 
      id: 'CRE001', 
      cliente: 'Juan Pérez', 
      cedula: '12345678',
      tipo: 'Personal', 
      monto: 5000000, 
      saldo: 3200000, 
      cuotas: '18/36', 
      estado: 'Activo', 
      fechaAprobacion: '2023-01-15', 
      tasaInteres: 12.5 
    },
    'CRE002': { 
      id: 'CRE002', 
      cliente: 'María García', 
      cedula: '87654321',
      tipo: 'Hipotecario', 
      monto: 150000000, 
      saldo: 142000000, 
      cuotas: '12/240', 
      estado: 'Activo', 
      fechaAprobacion: '2022-08-22', 
      tasaInteres: 8.5 
    },
    'CRE003': { 
      id: 'CRE003', 
      cliente: 'Carlos López', 
      cedula: '11223344',
      tipo: 'Vehículo', 
      monto: 25000000, 
      saldo: 18500000, 
      cuotas: '24/60', 
      estado: 'Activo', 
      fechaAprobacion: '2023-03-10', 
      tasaInteres: 15.2 
    },
    'CRE004': { 
      id: 'CRE004', 
      cliente: 'Ana Rodríguez', 
      cedula: '44332211',
      tipo: 'Personal', 
      monto: 3000000, 
      saldo: 850000, 
      cuotas: '30/36', 
      estado: 'Mora', 
      fechaAprobacion: '2021-12-05', 
      tasaInteres: 18.0 
    },
    'CRE005': { 
      id: 'CRE005', 
      cliente: 'Luis Martínez', 
      cedula: '55667788',
      tipo: 'Empresarial', 
      monto: 50000000, 
      saldo: 0, 
      cuotas: '48/48', 
      estado: 'Pagado', 
      fechaAprobacion: '2020-06-15', 
      tasaInteres: 10.5 
    }
  },
  transactions: [
    { id: 'TXN001', fecha: '2024-12-25', tipo: 'Depósito', cliente: 'Juan Pérez', cuenta: '1001234567', monto: 500000, estado: 'Completado' },
    { id: 'TXN002', fecha: '2024-12-25', tipo: 'Retiro', cliente: 'María García', cuenta: '1007654321', monto: 200000, estado: 'Completado' },
    { id: 'TXN003', fecha: '2024-12-25', tipo: 'Transferencia', cliente: 'Carlos López', cuenta: '1001122334', monto: 1500000, estado: 'Pendiente' },
    { id: 'TXN004', fecha: '2024-12-25', tipo: 'Pago', cliente: 'Ana Rodríguez', cuenta: '1004433221', monto: 85000, estado: 'Completado' },
    { id: 'TXN005', fecha: '2024-12-24', tipo: 'Depósito', cliente: 'Luis Martínez', cuenta: '1005566778', monto: 750000, estado: 'Completado' }
  ],
  payments: [],
  toasts: [],
  kpis: {
    totalDeposits: 45230000,
    totalWithdrawals: 32150000,
    totalTransactions: 1247,
    clientsAttended: 89
  }
};

// Reducer
function bankReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: {
          ...state.clients,
          [action.payload.cedula]: action.payload
        }
      };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: {
          ...state.clients,
          [action.payload.cedula]: {
            ...state.clients[action.payload.cedula],
            ...action.payload
          }
        }
      };
    
    case 'DELETE_CLIENT':
      const { [action.payload]: deletedClient, ...remainingClients } = state.clients;
      return {
        ...state,
        clients: remainingClients
      };
    
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.payload.numero]: action.payload
        }
      };
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.payload.numero]: {
            ...state.accounts[action.payload.numero],
            ...action.payload
          }
        }
      };
    
    case 'DELETE_ACCOUNT':
      const { [action.payload]: deletedAccount, ...remainingAccounts } = state.accounts;
      return {
        ...state,
        accounts: remainingAccounts
      };
    
    case 'ADD_CREDIT':
      return {
        ...state,
        credits: {
          ...state.credits,
          [action.payload.id]: action.payload
        }
      };
    
    case 'UPDATE_CREDIT':
      return {
        ...state,
        credits: {
          ...state.credits,
          [action.payload.id]: {
            ...state.credits[action.payload.id],
            ...action.payload
          }
        }
      };
    
    case 'DELETE_CREDIT':
      const { [action.payload]: deletedCredit, ...remainingCredits } = state.credits;
      return {
        ...state,
        credits: remainingCredits
      };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    
    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [action.payload, ...state.payments]
      };
    
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case 'UPDATE_KPIS':
      return {
        ...state,
        kpis: {
          ...state.kpis,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
}

// Provider component
export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  // Actions
  const actions = useMemo(() => ({
    // Client actions
    addClient: (client) => dispatch({ type: 'ADD_CLIENT', payload: client }),
    updateClient: (client) => dispatch({ type: 'UPDATE_CLIENT', payload: client }),
    deleteClient: (cedula) => dispatch({ type: 'DELETE_CLIENT', payload: cedula }),
    
    // Account actions
    addAccount: (account) => dispatch({ type: 'ADD_ACCOUNT', payload: account }),
    updateAccount: (account) => dispatch({ type: 'UPDATE_ACCOUNT', payload: account }),
    deleteAccount: (numero) => dispatch({ type: 'DELETE_ACCOUNT', payload: numero }),
    
    // Credit actions
    addCredit: (credit) => dispatch({ type: 'ADD_CREDIT', payload: credit }),
    updateCredit: (credit) => dispatch({ type: 'UPDATE_CREDIT', payload: credit }),
    deleteCredit: (id) => dispatch({ type: 'DELETE_CREDIT', payload: id }),
    
    // Transaction actions
    addTransaction: (transaction) => dispatch({ type: 'ADD_TRANSACTION', payload: transaction }),
    
    // Payment actions
    addPayment: (payment) => dispatch({ type: 'ADD_PAYMENT', payload: payment }),
    
    // Toast actions
    showToast: (message, type = 'info') => {
      dispatch({ 
        type: 'ADD_TOAST', 
        payload: { message, type } 
      });
    },
    removeToast: (id) => dispatch({ type: 'REMOVE_TOAST', payload: id }),
    
    // KPI actions
    updateKPIs: (kpis) => dispatch({ type: 'UPDATE_KPIS', payload: kpis })
  }), [dispatch]);

  // Auto-remove toasts after 3 seconds
  useEffect(() => {
    state.toasts.forEach(toast => {
      if (toast.id) {
        setTimeout(() => {
          actions.removeToast(toast.id);
        }, 3000);
      }
    });
  }, [state.toasts, actions]);

  return (
    <BankContext.Provider value={{ state, actions }}>
      {children}
    </BankContext.Provider>
  );
}

// Custom hook
export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}