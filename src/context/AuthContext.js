/**
 * CONTEXTO DE AUTENTICACIÓN - BANCO EXPRÉS
 * ========================================
 * 
 * Maneja todo el sistema de autenticación de la aplicación bancaria.
 * Incluye login, registro, logout y gestión de usuarios.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 * 
 * CARACTERÍSTICAS:
 * - Autenticación con email y contraseña
 * - Registro de nuevos usuarios
 * - Persistencia de sesión en localStorage
 * - Usuarios predefinidos para demo
 * - Gestión de estados de carga y errores
 * - Roles de usuario (admin, user)
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * ESTADO INICIAL DEL CONTEXTO
 * ===========================
 * 
 * Define el estado inicial de la autenticación y los usuarios del sistema.
 * Incluye usuarios predefinidos para propósitos de demostración.
 */
const initialState = {
  isAuthenticated: false, // Estado de autenticación del usuario
  user: null, // Datos del usuario autenticado
  loading: false, // Estado de carga para operaciones async
  error: null, // Mensajes de error
  
  // Usuarios predefinidos para demo del sistema bancario
  users: {
    'admin@bancoexpres.com': {
      id: '1',
      email: 'admin@bancoexpres.com',
      password: 'admin123', // En producción, esto estaría hasheado
      nombre: 'María González',
      cargo: 'Asesora Comercial',
      sucursal: 'Cúcuta Centro',
      telefono: '300-456-7890',
      fechaRegistro: '2023-01-15',
      avatar: '/profile.avif',
      role: 'admin' // Rol de administrador
    },
    'usuario@bancoexpres.com': {
      id: '2',
      email: 'usuario@bancoexpres.com',
      password: 'usuario123',
      nombre: 'Carlos Mendoza',
      cargo: 'Cajero',
      sucursal: 'Cúcuta Norte',
      telefono: '300-789-0123',
      fechaRegistro: '2023-06-20',
      avatar: null,
      role: 'user' // Rol de usuario estándar
    }
  }
};

/**
 * REDUCER DE AUTENTICACIÓN
 * ========================
 * 
 * Maneja todas las acciones relacionadas con la autenticación.
 * Utiliza el patrón reducer para gestión de estado predecible.
 */
function authReducer(state, action) {
  switch (action.type) {
    
    // Iniciar proceso de login
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Login exitoso
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    
    // Error en login
    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    
    // Cerrar sesión
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    
    // Iniciar proceso de registro
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Registro exitoso
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.email]: action.payload
        },
        loading: false,
        error: null
      };
    
    // Error en registro
    case 'REGISTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Limpiar errores
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

/**
 * PROVEEDOR DE CONTEXTO DE AUTENTICACIÓN
 * ======================================
 * 
 * Componente que envuelve la aplicación y proporciona
 * el contexto de autenticación a todos los componentes hijos.
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * EFECTO: Verificar Autenticación Guardada
   * ========================================
   * 
   * Al iniciar la aplicación, verifica si hay una sesión
   * guardada en localStorage y la restaura automáticamente.
   */
  useEffect(() => {
    const savedAuth = localStorage.getItem('bankAuth');
    if (savedAuth) {
      try {
        const { user } = JSON.parse(savedAuth);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem('bankAuth');
      }
    }
  }, []);

  /**
   * FUNCIÓN: Iniciar Sesión
   * =======================
   * 
   * Autentica al usuario con email y contraseña.
   * Simula una llamada a API con delay para UX realista.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {boolean} - true si el login es exitoso, false si falla
   */
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simular delay de API para UX realista
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = state.users[email];
    
    // Verificar si el usuario existe
    if (!user) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Usuario no encontrado' });
      return false;
    }
    
    // Verificar contraseña
    if (user.password !== password) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Contraseña incorrecta' });
      return false;
    }
    
    // Remover contraseña del objeto usuario por seguridad
    const { password: _, ...userWithoutPassword } = user;
    
    // Login exitoso
    dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
    localStorage.setItem('bankAuth', JSON.stringify({ user: userWithoutPassword }));
    
    return true;
  };

  /**
   * FUNCIÓN: Registrar Usuario
   * =========================
   * 
   * Registra un nuevo usuario en el sistema.
   * Verifica que el email no esté en uso.
   * 
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {boolean} - true si el registro es exitoso, false si falla
   */
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si el usuario ya existe
    if (state.users[userData.email]) {
      dispatch({ type: 'REGISTER_ERROR', payload: 'El usuario ya existe' });
      return false;
    }
    
    // Crear nuevo usuario con datos adicionales
    const newUser = {
      id: Date.now().toString(), // ID único basado en timestamp
      ...userData,
      fechaRegistro: new Date().toISOString().split('T')[0], // Fecha actual
      avatar: null, // Sin avatar inicial
      role: 'user' // Rol por defecto
    };
    
    dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
    return true;
  };

  /**
   * FUNCIÓN: Cerrar Sesión
   * ======================
   * 
   * Cierra la sesión del usuario y limpia el localStorage.
   */
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('bankAuth');
  };

  /**
   * FUNCIÓN: Limpiar Errores
   * ========================
   * 
   * Limpia los mensajes de error del estado.
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Proporcionar el contexto con estado y funciones
  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * HOOK PERSONALIZADO: useAuth
 * ===========================
 * 
 * Hook personalizado para acceder al contexto de autenticación.
 * Proporciona una interfaz limpia para usar la autenticación en componentes.
 * 
 * @returns {Object} - Estado y funciones de autenticación
 * @throws {Error} - Si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}