import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = ({ darkMode, onToggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Custom Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/fondo-registro.png')`,
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block text-center lg:text-left">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="mb-8">
                <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-2xl border border-gray-200 dark:border-gray-600">
                  <img 
                    src="/logo-actualizado.png" 
                    alt="Banco Exprés Logo" 
                    className="w-20 h-20 object-contain border border-gray-300 dark:border-gray-500 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hidden">
                    <i className="fas fa-university text-3xl"></i>
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                  Banco Exprés
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Sistema de Gestión Bancaria
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg flex items-center justify-center border border-primary-200 dark:border-primary-700">
                    <i className="fas fa-shield-alt text-primary-600 dark:text-primary-400 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Seguridad Avanzada</h3>
                    <p className="text-gray-600 dark:text-gray-400">Protección de datos bancarios</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-accent-100 dark:bg-gradient-to-br dark:from-success-900/20 dark:to-accent-900/20 rounded-lg flex items-center justify-center border border-success-200 dark:border-success-700">
                    <i className="fas fa-chart-line text-success-600 dark:text-success-400 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Gestión Completa</h3>
                    <p className="text-gray-600 dark:text-gray-400">Administra clientes y transacciones</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-accent-100 dark:bg-gradient-to-br dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg flex items-center justify-center border border-secondary-200 dark:border-secondary-700">
                    <i className="fas fa-clock text-secondary-600 dark:text-secondary-400 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Tiempo Real</h3>
                    <p className="text-gray-600 dark:text-gray-400">Información actualizada al instante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50">
              {/* Theme Toggle */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={onToggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors backdrop-blur-sm"
                  title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                >
                  <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
              </div>

              {/* Form Container */}
              <div className="transition-all duration-300">
                {isLogin ? (
                  <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          © 2025 anco Exprés. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;