import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const BankContext = createContext();

const initialState = {
  toasts: [],
  notifications: [], // Persistent notifications for the dropdown
  modalNotifications: [] // Modal notifications
};

function bankReducer(state, action) {
  switch (action.type) {
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
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [{ ...action.payload, id: Date.now(), timestamp: new Date() }, ...state.notifications]
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };

    case 'ADD_MODAL_NOTIFICATION':
      return {
        ...state,
        modalNotifications: [...state.modalNotifications, { ...action.payload, id: Date.now() }]
      };
      
    case 'REMOVE_MODAL_NOTIFICATION':
      return {
        ...state,
        modalNotifications: state.modalNotifications.filter(modal => modal.id !== action.payload)
      };
    
    default:
      return state;
  }
}

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  const { user } = useAuth();

  const actions = useMemo(() => ({
    showToast: (message, type = 'info') => {
      dispatch({ 
        type: 'ADD_TOAST', 
        payload: { message, type } 
      });
    },
    removeToast: (id) => dispatch({ type: 'REMOVE_TOAST', payload: id }),
    addNotification: (message, type = 'info') => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { message, type }
      });
    },
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
    showModalNotification: (message, type = 'info') => {
      dispatch({ 
        type: 'ADD_MODAL_NOTIFICATION', 
        payload: { message, type } 
      });
    },
    removeModalNotification: (id) => dispatch({ type: 'REMOVE_MODAL_NOTIFICATION', payload: id }),
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

  // Socket.IO Integration
  useEffect(() => {
    if (user) {
      // Connect to the backend
      const socket = io('http://localhost:5001');

      socket.on('connect', () => {
        // Register the user role and email to join the right room
        socket.emit('register', { role: user.role, email: user.email });
      });

      // Listen for notifications
      socket.on('notification', (data) => {
        actions.showModalNotification(data.message, data.type || 'info');
        actions.addNotification(data.message, data.type || 'info');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, actions]);

  return (
    <BankContext.Provider value={{ state, actions }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}