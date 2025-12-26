import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../UI/Breadcrumbs';

const ConfigurationSection = () => {
  const { actions } = useBank();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || 'Usuario',
    email: user?.email || 'usuario@bancoexpres.com',
    telefono: user?.telefono || '300-000-0000',
    cargo: user?.cargo || 'Empleado',
    sucursal: user?.sucursal || 'Cúcuta Centro'
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
    systemAlerts: true
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: 'fas fa-user' },
    { id: 'security', name: 'Seguridad', icon: 'fas fa-shield-alt' },
    { id: 'notifications', name: 'Notificaciones', icon: 'fas fa-bell' },
    { id: 'system', name: 'Sistema', icon: 'fas fa-cog' }
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    actions.showToast('Perfil actualizado exitosamente', 'success');
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      actions.showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      actions.showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    actions.showToast('Contraseña actualizada exitosamente', 'success');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    actions.showToast('Configuración de notificaciones actualizada', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs 
        items={[
          { label: 'Inicio', icon: 'fas fa-home' },
          { label: 'Configuración', active: true }
        ]} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra la configuración de tu cuenta y del sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Información del Perfil
                </h3>
                
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="relative">
                    <img
                      src="/profile.avif"
                      alt="Foto de perfil"
                      className="w-28 h-28 rounded-full object-cover border-4 border-primary-200 dark:border-primary-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-28 h-28 bg-primary-100 dark:bg-primary-900 rounded-full border-4 border-primary-200 dark:border-primary-600 flex items-center justify-center hidden"
                    >
                      <i className="fas fa-user text-primary-600 dark:text-primary-400 text-3xl"></i>
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                      <i className="fas fa-camera text-sm"></i>
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user?.nombre || 'Usuario'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user?.cargo || 'Empleado'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Banco Exprés - {user?.sucursal || 'Cúcuta Centro'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({...profileData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={profileData.telefono}
                        onChange={(e) => setProfileData({...profileData, telefono: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={profileData.cargo}
                        onChange={(e) => setProfileData({...profileData, cargo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sucursal
                      </label>
                      <select
                        value={profileData.sucursal}
                        onChange={(e) => setProfileData({...profileData, sucursal: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Cúcuta Centro">Cúcuta Centro</option>
                        <option value="Cúcuta Norte">Cúcuta Norte</option>
                        <option value="Cúcuta Sur">Cúcuta Sur</option>
                        <option value="Villa del Rosario">Villa del Rosario</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración de Seguridad
                </h3>
                <form onSubmit={handleSecuritySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Actualizar Contraseña
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración de Notificaciones
                </h3>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notificaciones por Email
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Recibir notificaciones importantes por correo electrónico
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationData.emailNotifications}
                          onChange={(e) => setNotificationData({...notificationData, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notificaciones SMS
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Recibir alertas críticas por mensaje de texto
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationData.smsNotifications}
                          onChange={(e) => setNotificationData({...notificationData, smsNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notificaciones Push
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Mostrar notificaciones en el navegador
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationData.pushNotifications}
                          onChange={(e) => setNotificationData({...notificationData, pushNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Alertas de Transacciones
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notificar sobre transacciones importantes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationData.transactionAlerts}
                          onChange={(e) => setNotificationData({...notificationData, transactionAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Alertas del Sistema
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notificar sobre actualizaciones y mantenimiento
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationData.systemAlerts}
                          onChange={(e) => setNotificationData({...notificationData, systemAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Guardar Configuración
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Configuración del Sistema
                </h3>
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                      Información del Sistema
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Versión:</span>
                        <span className="text-blue-900 dark:text-blue-100">1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Última actualización:</span>
                        <span className="text-blue-900 dark:text-blue-100">25/12/2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Estado:</span>
                        <span className="text-green-600 dark:text-green-400">Operativo</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                      Mantenimiento
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Estas opciones requieren permisos de administrador del sistema.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        Respaldar Base de Datos
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        Limpiar Logs del Sistema
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        Verificar Integridad de Datos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSection;