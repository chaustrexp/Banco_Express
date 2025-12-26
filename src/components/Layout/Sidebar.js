/**
 * COMPONENTE SIDEBAR - NAVEGACIÓN PRINCIPAL
 * ========================================
 * 
 * Sidebar de navegación del dashboard bancario con menú colapsible,
 * información del usuario y navegación entre secciones principales.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 * 
 * CARACTERÍSTICAS:
 * - Navegación entre 8 secciones principales
 * - Modo colapsible para desktop
 * - Overlay para mobile con backdrop
 * - Información del usuario logueado
 * - Logo del banco con fallback
 * - Estados activos visuales
 * - Responsive design completo
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * COMPONENTE SIDEBAR
 * ==================
 * 
 * @param {boolean} collapsed - Estado de colapso del sidebar (desktop)
 * @param {boolean} open - Estado de apertura del sidebar (mobile)
 * @param {string} activeSection - Sección actualmente activa
 * @param {function} onSectionChange - Callback para cambiar de sección
 * @param {function} onClose - Callback para cerrar sidebar en mobile
 */
const Sidebar = ({ collapsed, open, activeSection, onSectionChange, onClose }) => {
  // Obtener información del usuario autenticado
  const { user } = useAuth();
  
  /**
   * CONFIGURACIÓN DEL MENÚ
   * ======================
   * 
   * Define todas las secciones disponibles en el sidebar con sus
   * identificadores, etiquetas e iconos de Font Awesome.
   */
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
    { id: 'clientes', label: 'Clientes', icon: 'fas fa-users' },
    { id: 'cuentas', label: 'Cuentas', icon: 'fas fa-credit-card' },
    { id: 'transacciones', label: 'Transacciones', icon: 'fas fa-exchange-alt' },
    { id: 'creditos', label: 'Créditos', icon: 'fas fa-hand-holding-usd' },
    { id: 'pagos', label: 'Pagos y Recaudos', icon: 'fas fa-receipt' },
    { id: 'reportes', label: 'Reportes', icon: 'fas fa-chart-bar' },
    { id: 'configuracion', label: 'Configuración', icon: 'fas fa-cog' }
  ];

  /**
   * FUNCIÓN: Manejar Click en Item del Menú
   * =======================================
   * 
   * Cambia la sección activa y cierra el sidebar en mobile.
   * Mejora la UX en dispositivos táctiles.
   * 
   * @param {string} itemId - ID de la sección seleccionada
   */
  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
    // Cerrar sidebar automáticamente en mobile después de seleccionar
    if (window.innerWidth <= 992) {
      onClose();
    }
  };

  return (
    <>
      {/* SIDEBAR PRINCIPAL */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        shadow-lg z-50 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-16 xs:w-20' : 'w-64 xs:w-72'}
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* HEADER DEL SIDEBAR */}
        <div className="p-3 xs:p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          
          {/* LOGO DEL BANCO */}
          <div className={`flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 xs:w-10 h-8 xs:h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600">
              {/* Logo principal con fallback */}
              <img 
                src="/logo-actualizado.png" 
                alt="Banco Exprés Logo" 
                className="w-6 xs:w-8 h-6 xs:h-8 object-contain border border-gray-300 dark:border-gray-500 rounded"
                onError={(e) => {
                  // Fallback: ocultar imagen y mostrar icono
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Icono de fallback si la imagen no carga */}
              <div className="w-6 xs:w-8 h-6 xs:h-8 bg-primary-500 rounded flex items-center justify-center text-white hidden">
                <i className="fas fa-university text-xs xs:text-sm"></i>
              </div>
            </div>
            {/* Texto del logo (oculto cuando está colapsado) */}
            {!collapsed && (
              <span className="text-lg xs:text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Banco Exprés
              </span>
            )}
          </div>

          {/* INFORMACIÓN DEL USUARIO */}
          {!collapsed && (
            <div className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="relative">
                {/* Avatar del usuario con fallback */}
                <img
                  src="/profile.avif"
                  alt="Foto de perfil"
                  className="w-10 xs:w-12 h-10 xs:h-12 rounded-full object-cover border-2 border-primary-200 dark:border-primary-600"
                  onError={(e) => {
                    // Fallback: ocultar imagen y mostrar icono
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Avatar de fallback */}
                <div 
                  className="w-10 xs:w-12 h-10 xs:h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hidden"
                >
                  <i className="fas fa-user text-sm xs:text-base"></i>
                </div>
              </div>
              {/* Información del usuario */}
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.cargo || 'Empleado'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex-1 p-2 xs:p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-3 rounded-lg text-left transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${activeSection === item.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
                }
              `}
              title={collapsed ? item.label : ''} // Tooltip cuando está colapsado
              aria-label={item.label}
            >
              {/* Icono del item */}
              <i className={`${item.icon} text-base xs:text-lg ${collapsed ? '' : 'w-4 xs:w-5'}`}></i>
              {/* Etiqueta del item (oculta cuando está colapsado) */}
              {!collapsed && (
                <span className="font-medium text-sm xs:text-base">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* INDICADOR DE USUARIO COLAPSADO (Solo desktop) */}
        {collapsed && (
          <div className="hidden lg:block p-2 xs:p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-2">
              {/* Avatar pequeño */}
              <div className="relative">
                <img
                  src="/profile.avif"
                  alt="Foto de perfil"
                  className="w-8 xs:w-10 h-8 xs:h-10 rounded-full object-cover border-2 border-primary-200 dark:border-primary-600"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-8 xs:w-10 h-8 xs:h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs xs:text-sm hidden"
                >
                  <i className="fas fa-user"></i>
                </div>
              </div>
              {/* Indicador de estado online */}
              <div className="w-2 h-2 bg-success-500 rounded-full" title="En línea"></div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;