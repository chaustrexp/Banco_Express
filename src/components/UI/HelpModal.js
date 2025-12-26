/**
 * COMPONENTE MODAL DE AYUDA
 * =========================
 * 
 * Modal con información de ayuda, guías de uso y soporte
 * para los usuarios del dashboard bancario.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 */

import React, { useState } from 'react';

/**
 * COMPONENTE HELP MODAL
 * =====================
 * 
 * @param {boolean} isOpen - Estado de apertura del modal
 * @param {function} onClose - Callback para cerrar el modal
 */
const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('guide');

  // Datos de ayuda organizados por categorías
  const helpData = {
    guide: {
      title: 'Guía de Uso',
      icon: 'fas fa-book',
      content: [
        {
          title: 'Navegación Principal',
          items: [
            'Use el sidebar izquierdo para navegar entre secciones',
            'El menú hamburguesa colapsa/expande el sidebar',
            'En móvil, toque fuera del sidebar para cerrarlo'
          ]
        },
        {
          title: 'Dashboard Principal',
          items: [
            'Los KPIs muestran métricas del día actual',
            'Los gráficos son interactivos - hover para detalles',
            'Las transacciones recientes se actualizan en tiempo real'
          ]
        },
        {
          title: 'Gestión de Clientes',
          items: [
            'Use la búsqueda para encontrar clientes rápidamente',
            'Los estados de cliente afectan las operaciones disponibles',
            'Los clientes VIP tienen beneficios especiales'
          ]
        },
        {
          title: 'Transacciones',
          items: [
            'Todas las transacciones requieren confirmación',
            'Los límites diarios se aplican automáticamente',
            'Las transacciones pendientes pueden cancelarse'
          ]
        }
      ]
    },
    shortcuts: {
      title: 'Atajos de Teclado',
      icon: 'fas fa-keyboard',
      content: [
        {
          title: 'Navegación General',
          items: [
            'Ctrl + / - Abrir búsqueda global',
            'Ctrl + D - Ir al Dashboard',
            'Ctrl + C - Ir a Clientes',
            'Ctrl + T - Ir a Transacciones'
          ]
        },
        {
          title: 'Acciones Rápidas',
          items: [
            'Ctrl + N - Nueva transacción',
            'Ctrl + F - Abrir filtros',
            'Ctrl + P - Imprimir reporte',
            'Esc - Cerrar modal activo'
          ]
        },
        {
          title: 'Tema y Vista',
          items: [
            'Ctrl + Shift + D - Cambiar tema oscuro/claro',
            'Ctrl + B - Colapsar/expandir sidebar',
            'F11 - Pantalla completa'
          ]
        }
      ]
    },
    faq: {
      title: 'Preguntas Frecuentes',
      icon: 'fas fa-question-circle',
      content: [
        {
          title: '¿Cómo realizar una transacción?',
          items: [
            '1. Vaya a la sección de Transacciones',
            '2. Seleccione el tipo de operación',
            '3. Complete los datos requeridos',
            '4. Confirme la transacción'
          ]
        },
        {
          title: '¿Cómo buscar un cliente?',
          items: [
            'Use la barra de búsqueda en el header',
            'Puede buscar por cédula, nombre o email',
            'Los resultados aparecen mientras escribe'
          ]
        },
        {
          title: '¿Cómo generar reportes?',
          items: [
            'Vaya a la sección de Reportes',
            'Seleccione el tipo de reporte deseado',
            'Configure las fechas y filtros',
            'Haga clic en "Generar Reporte"'
          ]
        },
        {
          title: '¿Qué hacer si hay un error?',
          items: [
            'Verifique su conexión a internet',
            'Actualice la página (F5)',
            'Si persiste, contacte al soporte técnico'
          ]
        }
      ]
    },
    contact: {
      title: 'Contacto y Soporte',
      icon: 'fas fa-headset',
      content: [
        {
          title: 'Soporte Técnico',
          items: [
            'Teléfono: +57 (7) 123-4567',
            'Email: soporte@bancoexpres.com',
            'Horario: Lunes a Viernes 8:00 AM - 6:00 PM',
            'Sábados: 8:00 AM - 12:00 PM'
          ]
        },
        {
          title: 'Oficina Principal',
          items: [
            'Dirección: Calle 10 #5-25, Centro',
            'Cúcuta, Norte de Santander',
            'Código Postal: 540001',
            'Teléfono: +57 (7) 123-4500'
          ]
        },
        {
          title: 'Emergencias',
          items: [
            'Línea de emergencia 24/7: 123',
            'Bloqueo de tarjetas: *123#',
            'Reporte de fraude: fraude@bancoexpres.com'
          ]
        }
      ]
    }
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl mx-2 xs:mx-4" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER DEL MODAL */}
        <div className="modal-header">
          <h2 className="modal-title text-base xs:text-lg sm:text-xl">
            <i className="fas fa-question-circle mr-2 text-primary-500"></i>
            Centro de Ayuda
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Cerrar modal"
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"></i>
          </button>
        </div>

        {/* CONTENIDO DEL MODAL */}
        <div className="modal-body">
          
          {/* TABS DE NAVEGACIÓN */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4 xs:mb-6 overflow-x-auto">
            {Object.entries(helpData).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-4 py-2 font-medium text-xs xs:text-sm border-b-2 transition-colors duration-200 whitespace-nowrap ${
                  activeTab === key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <i className={`${section.icon} text-xs xs:text-sm`}></i>
                <span className="hidden xs:inline">{section.title}</span>
              </button>
            ))}
          </div>

          {/* CONTENIDO DE LA TAB ACTIVA */}
          <div className="space-y-4 xs:space-y-6">
            <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <i className={`${helpData[activeTab].icon} text-primary-500 text-sm xs:text-base`}></i>
              {helpData[activeTab].title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6">
              {helpData[activeTab].content.map((section, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 xs:p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 text-sm xs:text-base">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 xs:space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-xs xs:text-sm text-gray-600 dark:text-gray-300">
                        <i className="fas fa-check-circle text-success-500 mt-0.5 flex-shrink-0 text-xs"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* INFORMACIÓN ADICIONAL PARA LA TAB DE CONTACTO */}
            {activeTab === 'contact' && (
              <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-2 xs:gap-3">
                  <i className="fas fa-info-circle text-primary-500 mt-1 text-sm xs:text-base"></i>
                  <div>
                    <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2 text-sm xs:text-base">
                      Información Importante
                    </h4>
                    <p className="text-xs xs:text-sm text-primary-800 dark:text-primary-200">
                      Para garantizar la seguridad de sus operaciones, nunca comparta sus credenciales 
                      de acceso. El personal de Banco Exprés nunca le solicitará esta información por 
                      teléfono o email.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="modal-footer flex-col xs:flex-row gap-2 xs:gap-4">
          <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-gray-500 dark:text-gray-400 order-2 xs:order-1">
            <span>¿No encuentra lo que busca?</span>
            <a 
              href="mailto:soporte@bancoexpres.com"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Contactar Soporte
            </a>
          </div>
          <button
            onClick={onClose}
            className="btn-primary text-xs xs:text-sm w-full xs:w-auto order-1 xs:order-2"
          >
            <i className="fas fa-check mr-2"></i>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;