import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    password: '',
    confirmPassword: '',
    rol: 'user',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    // Calculate password strength
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    if (!formData.acceptTerms) {
      return;
    }
    
    const success = await register({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      rol: formData.rol,
      cedula: formData.cedula
    });
    
    if (success) {
      onSwitchToLogin();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <div className="lg:hidden flex justify-center mb-6">
          <img 
            src="/img/logo/logo.jpeg" 
            alt="Banco Exprés Logo" 
            className="w-20 h-20 object-contain rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Crear Cuenta
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Únete a Banco Exprés hoy mismo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl animate-shake">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            Nombre Completo
          </label>
          <div className="relative group">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3.5 pl-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-gray-900 dark:text-white transition-all shadow-sm"
              placeholder="Juan Pérez"
              required
            />
            <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 pl-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-gray-900 dark:text-white transition-all shadow-sm"
                placeholder="tu@correo.com"
                required
              />
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Rol de Usuario
            </label>
            <div className="relative group">
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-gray-900 dark:text-white transition-all shadow-sm appearance-none"
                required
              >
                <option value="user">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {formData.rol === 'user' && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Cédula
            </label>
            <div className="relative group">
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full px-4 py-3.5 pl-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-gray-900 dark:text-white transition-all shadow-sm"
                placeholder="Número de identificación"
                required={formData.rol === 'user'}
              />
              <i className="fas fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 pl-12 pr-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-gray-900 dark:text-white transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 w-full">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5 relative mt-1 md:mt-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Confirmar
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 pl-12 pr-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-900 dark:text-white transition-all shadow-sm ${
                  formData.confirmPassword && !passwordsMatch 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
                }`}
                placeholder="••••••••"
                required
              />
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs mt-1 absolute">Las contraseñas no coinciden</p>
            )}
          </div>
        </div>

        <div className="flex items-center pt-2">
          <label className="flex items-center cursor-pointer group">
            <div className="relative w-5 h-5 flex justify-center items-center mr-2">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-primary-600 checked:border-primary-600 transition-colors cursor-pointer"
                required
              />
              {formData.acceptTerms && (
                <i className="fas fa-check absolute text-white text-xs pointer-events-none"></i>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
              Acepto los <span className="text-primary-600 dark:text-primary-400 font-semibold cursor-pointer">términos y condiciones</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !passwordsMatch || !formData.acceptTerms}
          className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </>
          ) : (
            <>
              Crear Cuenta <i className="fas fa-user-plus ml-2"></i>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold ml-1 hover:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;