/**
 * APLICACIÓN PRINCIPAL - BANCO EXPRÉS DASHBOARD
 * =============================================
 * 
 * Componente raíz de la aplicación del dashboard bancario.
 * Maneja la autenticación, navegación entre secciones, tema oscuro/claro,
 * y la estructura general de la aplicación.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * - Sistema de autenticación completo
 * - Navegación entre 8 secciones principales
 * - Tema oscuro/claro con persistencia
 * - Sidebar responsive con hamburger menu
 * - Gestión de estado con Context API
 * - Diseño mobile-first
 */

import { useState, useEffect } from 'react';

// Importar componentes de layout
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Importar componentes de secciones principales
import Dashboard from './components/Dashboard/Dashboard';
import ClientsSection from './components/Clients/ClientsSection';
import AccountsSection from './components/Accounts/AccountsSection';
import TransactionsSection from './components/Transactions/TransactionsSection';
import CreditsSection from './components/Credits/CreditsSection';
import PaymentsSection from './components/Payments/PaymentsSection';
import ReportsSection from './components/Reports/ReportsSection';
import ConfigurationSection from './components/Configuration/ConfigurationSection';

// Importar componentes de autenticación y UI
import AuthPage from './components/Auth/AuthPage';
import Toast from './components/UI/Toast';

// Importar contextos para gestión de estado
import { BankProvider } from './context/BankContext';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * ====================================
 * 
 * Maneja toda la lógica de la aplicación incluyendo:
 * - Estado de autenticación
 * - Navegación entre secciones
 * - Control del sidebar (colapso/apertura)
 * - Tema oscuro/claro
 * - Responsive design
 */
function AppContent() {
  // Obtener estado de autenticación del contexto
  const { isAuthenticated } = useAuth();
  
  // Estados locales para la UI
  const [activeSection, setActiveSection] = useState('dashboard'); // Sección activa actual
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Estado de colapso del sidebar (desktop)
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado de apertura del sidebar (mobile)
  
  // Estado del tema oscuro con persistencia en localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  /**
   * EFECTO: Persistencia del tema oscuro
   * ===================================
   * 
   * Guarda la preferencia del tema en localStorage y aplica
   * la clase 'dark' al elemento HTML para Tailwind CSS.
   */
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  /**
   * FUNCIÓN: Toggle del Sidebar
   * ===========================
   * 
   * Maneja la apertura/cierre del sidebar de forma responsive:
   * - En mobile (≤992px): Abre/cierra overlay
   * - En desktop (>992px): Colapsa/expande sidebar
   */
  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  /**
   * FUNCIÓN: Cerrar Sidebar
   * =======================
   * 
   * Cierra el sidebar en modo mobile (usado cuando se hace clic en overlay)
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * FUNCIÓN: Renderizar Sección Activa
   * ==================================
   * 
   * Renderiza el componente correspondiente a la sección seleccionada.
   * Utiliza un switch para determinar qué componente mostrar.
   */
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <ClientsSection />;
      case 'cuentas':
        return <AccountsSection />;
      case 'transacciones':
        return <TransactionsSection />;
      case 'creditos':
        return <CreditsSection />;
      case 'pagos':
        return <PaymentsSection />;
      case 'reportes':
        return <ReportsSection />;
      case 'configuracion':
        return <ConfigurationSection />;
      default:
        return <Dashboard />; // Fallback al dashboard
    }
  };

  /**
   * RENDERIZADO CONDICIONAL: Página de Autenticación
   * ================================================
   * 
   * Si el usuario no está autenticado, muestra la página de login/registro
   */
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AuthPage 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)} 
        />
      </div>
    );
  }

  /**
   * RENDERIZADO PRINCIPAL: Dashboard Bancario
   * =========================================
   * 
   * Estructura principal de la aplicación cuando el usuario está autenticado:
   * - Overlay para mobile
   * - Sidebar de navegación
   * - Header con controles
   * - Contenido principal
   * - Sistema de toasts
   */
  return (
    <BankProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        
        {/* Overlay del Sidebar para Mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          />
        )}

        {/* Sidebar de Navegación */}
        <Sidebar
          collapsed={sidebarCollapsed}
          open={sidebarOpen}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onClose={closeSidebar}
        />

        {/* Contenido Principal */}
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}>
          
          {/* Header Superior */}
          <Header
            onToggleSidebar={toggleSidebar}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            sidebarCollapsed={sidebarCollapsed}
            onNavigateToConfig={() => setActiveSection('configuracion')}
          />

          {/* Contenido de la Página */}
          <main className="p-2 xs:p-3 sm:p-4 lg:p-6 xl:p-8">
            {renderActiveSection()}
          </main>
        </div>

        {/* Contenedor de Toasts para Notificaciones */}
        <Toast />
      </div>
    </BankProvider>
  );
}

/**
 * COMPONENTE WRAPPER: Proveedor de Autenticación
 * ==============================================
 * 
 * Envuelve toda la aplicación con el AuthProvider para
 * proporcionar el contexto de autenticación a todos los componentes.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;