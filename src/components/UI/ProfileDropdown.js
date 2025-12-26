/**
 * COMPONENTE PROFILE DROPDOWN
 * ===========================
 * 
 * Menú desplegable del perfil de usuario con opciones de
 * configuración, ayuda y cierre de sesión.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import HelpModal from './HelpModal';

/**
 * COMPONENTE PROFILE DROPDOWN
 * ===========================
 * 
 * @param {function} onNavigateToConfig - Callback para navegar a configuración
 */
const ProfileDropdown = ({ onNavigateToConfig }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * EFECTO: Cerrar dropdown al hacer clic fuera
   * ===========================================
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * CONFIGURACIÓN DEL MENÚ
   * ======================
   * 
   * Define los elementos del menú desplegable con sus acciones.
   */
  const menuItems = [
    {
      id: 'profile',
      label: 'Ver Perfil',
      icon: 'fas fa-user',
      action: () => {
        onNavigateToConfig && onNavigateToConfig();
        setIsOpen(false);
      }
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: 'fas fa-cog',
      action: () => {
        onNavigateToConfig && onNavigateToConfig();
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'Ayuda',
      icon: 'fas fa-question-circle',
      action: () => {
        setShowHelp(true);
        setIsOpen(false);
      }
    },
    {
      id: 'logout',
      label: 'Cerrar Sesión',
      icon: 'fas fa-sign-out-alt',
      action: () => {
        logout();
        setIsOpen(false);
      },
      danger: true
    }
  ];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* BOTÓN DEL PERFIL */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Menú de perfil"
        >
          {/* Avatar del usuario */}
          <div className="relative">
            <img
              src="/profile.avif"
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 dark:border-primary-600"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm hidden"
            >
              <i className="fas fa-user"></i>
            </div>
          </div>
          
          {/* Información del usuario (oculta en mobile) */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.nombre || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.cargo || 'Empleado'}
            </p>
          </div>
          
          {/* Icono de flecha */}
          <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* MENÚ DESPLEGABLE */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
            
            {/* HEADER CON INFORMACIÓN DEL USUARIO */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/profile.avif"
                    alt="Foto de perfil"
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 dark:border-primary-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm hidden"
                  >
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'usuario@bancoexpres.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* ELEMENTOS DEL MENÚ */}
            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    item.danger 
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                  title={item.label}
                >
                  <i className={`${item.icon} text-sm w-4`}></i>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE AYUDA */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

export default ProfileDropdown;