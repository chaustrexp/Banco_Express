import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    cargo: '',
    sucursal: 'Cúcuta Centro',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      telefono: formData.telefono,
      cargo: formData.cargo,
      sucursal: formData.sucursal
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

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Muy débil';
      case 2:
        return 'Débil';
      case 3:
        return 'Media';
      case 4:
        return 'Fuerte';
      case 5:
        return 'Muy fuerte';
      default:
        return '';
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-200 dark:border-gray-600">
          <img 
            src="/logo-actualizado.png" 
            alt="Banco Exprés Logo" 
            className="w-16 h-16 object-contain border border-gray-300 dark:border-gray-500 rounded"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hidden">
            <i className="fas fa-university text-2xl"></i>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Banco Exprés
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Crea tu cuenta de empleado
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre Completo *
          </label>
          <div className="relative">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tu nombre completo"
              required
            />
            <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo Electrónico *
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="tu@bancoexpres.com"
              required
            />
            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="300-123-4567"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cargo *
            </label>
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Cajero">Cajero</option>
              <option value="Asesor Comercial">Asesor Comercial</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Gerente">Gerente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sucursal *
          </label>
          <select
            name="sucursal"
            value={formData.sucursal}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="Cúcuta Centro">Cúcuta Centro</option>
            <option value="Cúcuta Norte">Cúcuta Norte</option>
            <option value="Cúcuta Sur">Cúcuta Sur</option>
            <option value="Villa del Rosario">Villa del Rosario</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="••••••••"
              required
            />
            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {getPasswordStrengthText()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Contraseña *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                formData.confirmPassword && !passwordsMatch 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="••••••••"
              required
            />
            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
            required
          />
          <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Acepto los{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              términos y condiciones
            </button>
            {' '}y la{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              política de privacidad
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !passwordsMatch || !formData.acceptTerms}
          className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:from-primary-400 disabled:to-secondary-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus mr-2"></i>
              Crear Cuenta
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;