import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = ({ darkMode, onToggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-90" style={{ backgroundImage: "url('/img/fondo/fondo-registro.png')" }}>
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto z-10 flex shadow-2xl rounded-3xl overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/50">
        
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative bg-gradient-to-br from-primary-600/90 to-secondary-800/90 text-white">
          
          <div className="relative z-10">
            <img 
              src="/img/logo/logo.jpeg" 
              alt="Banco Exprés Logo" 
              className="w-24 h-24 object-contain mb-8 rounded-2xl shadow-lg border border-white/20"
            />
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Bienvenido al futuro <br/>de tus finanzas.
            </h1>
            <p className="text-primary-100 text-lg max-w-md">
              Gestiona, transfiere y haz crecer tu dinero con la plataforma más segura y rápida del mercado.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <i className="fas fa-shield-alt text-2xl mb-2 text-primary-200"></i>
                <h4 className="font-semibold text-sm">Seguridad Militar</h4>
                <p className="text-xs text-primary-100/80 mt-1">Tus fondos siempre protegidos.</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <i className="fas fa-bolt text-2xl mb-2 text-accent-200"></i>
                <h4 className="font-semibold text-sm">0 Comisiones</h4>
                <p className="text-xs text-primary-100/80 mt-1">En transferencias entre cuentas.</p>
              </div>
            </div>
            <p className="text-sm text-primary-200/80">© 2025 Banco Exprés. Todos los derechos reservados.</p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 relative">
          {/* Theme Toggle */}
          <div className="absolute top-6 right-6">
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>

          <div className="max-w-md mx-auto mt-4 transition-all duration-300">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;