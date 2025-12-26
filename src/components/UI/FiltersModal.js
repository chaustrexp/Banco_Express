/**
 * COMPONENTE MODAL DE FILTROS
 * ===========================
 * 
 * Modal para filtrar datos por diferentes criterios como fechas,
 * tipos de transacciones, estados, montos, etc.
 * 
 * @author Banco Exprés Development Team
 * @version 1.0.0
 * @created 2024-12-26
 */

import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';

/**
 * COMPONENTE FILTERS MODAL
 * ========================
 * 
 * @param {boolean} isOpen - Estado de apertura del modal
 * @param {function} onClose - Callback para cerrar el modal
 * @param {function} onApplyFilters - Callback para aplicar filtros
 */
const FiltersModal = ({ isOpen, onClose, onApplyFilters }) => {
  const { actions } = useBank();

  // Estados para los filtros
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    transactionType: '',
    status: '',
    amountMin: '',
    amountMax: '',
    clientType: '',
    branch: ''
  });

  /**
   * FUNCIÓN: Manejar Cambio de Filtro
   * =================================
   * 
   * Actualiza el estado de los filtros cuando el usuario
   * cambia algún valor en el formulario.
   */
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * FUNCIÓN: Aplicar Filtros
   * ========================
   * 
   * Aplica los filtros seleccionados y cierra el modal.
   */
  const handleApplyFilters = () => {
    onApplyFilters(filters);
    actions.showToast('Filtros aplicados correctamente', 'success');
    onClose();
  };

  /**
   * FUNCIÓN: Limpiar Filtros
   * ========================
   * 
   * Resetea todos los filtros a sus valores por defecto.
   */
  const handleClearFilters = () => {
    const emptyFilters = {
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      status: '',
      amountMin: '',
      amountMax: '',
      clientType: '',
      branch: ''
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    actions.showToast('Filtros limpiados', 'info');
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-2 xs:mx-4" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER DEL MODAL */}
        <div className="modal-header">
          <h2 className="modal-title text-base xs:text-lg sm:text-xl">
            <i className="fas fa-filter mr-2 text-primary-500"></i>
            Filtros Avanzados
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6">
            
            {/* FILTROS DE FECHA */}
            <div className="space-y-3 xs:space-y-4">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3">
                <i className="fas fa-calendar-alt mr-2 text-primary-500"></i>
                Rango de Fechas
              </h3>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Fecha Desde</label>
                <input
                  type="date"
                  className="form-input text-xs xs:text-sm"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Fecha Hasta</label>
                <input
                  type="date"
                  className="form-input text-xs xs:text-sm"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            {/* FILTROS DE TRANSACCIÓN */}
            <div className="space-y-3 xs:space-y-4">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3">
                <i className="fas fa-exchange-alt mr-2 text-primary-500"></i>
                Tipo de Operación
              </h3>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Tipo de Transacción</label>
                <select
                  className="form-select text-xs xs:text-sm"
                  value={filters.transactionType}
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Depósito">Depósito</option>
                  <option value="Retiro">Retiro</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Pago">Pago de Servicios</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Estado</label>
                <select
                  className="form-select text-xs xs:text-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Fallido">Fallido</option>
                </select>
              </div>
            </div>

            {/* FILTROS DE MONTO */}
            <div className="space-y-3 xs:space-y-4">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3">
                <i className="fas fa-dollar-sign mr-2 text-primary-500"></i>
                Rango de Montos
              </h3>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Monto Mínimo (COP)</label>
                <input
                  type="number"
                  className="form-input text-xs xs:text-sm"
                  placeholder="0"
                  value={filters.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Monto Máximo (COP)</label>
                <input
                  type="number"
                  className="form-input text-xs xs:text-sm"
                  placeholder="Sin límite"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                />
              </div>
            </div>

            {/* FILTROS DE CLIENTE */}
            <div className="space-y-3 xs:space-y-4">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3">
                <i className="fas fa-users mr-2 text-primary-500"></i>
                Información del Cliente
              </h3>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Tipo de Cliente</label>
                <select
                  className="form-select text-xs xs:text-sm"
                  value={filters.clientType}
                  onChange={(e) => handleFilterChange('clientType', e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Activo">Activo</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label text-xs xs:text-sm">Sucursal</label>
                <select
                  className="form-select text-xs xs:text-sm"
                  value={filters.branch}
                  onChange={(e) => handleFilterChange('branch', e.target.value)}
                >
                  <option value="">Todas las sucursales</option>
                  <option value="Cúcuta Centro">Cúcuta Centro</option>
                  <option value="Cúcuta Norte">Cúcuta Norte</option>
                  <option value="Cúcuta Sur">Cúcuta Sur</option>
                  <option value="Villa del Rosario">Villa del Rosario</option>
                  <option value="Los Patios">Los Patios</option>
                </select>
              </div>
            </div>
          </div>

          {/* RESUMEN DE FILTROS ACTIVOS */}
          <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white mb-2">
              Filtros Activos:
            </h4>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 xs:px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  >
                    {key}: {value}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-100"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                );
              })}
              {Object.values(filters).every(v => !v) && (
                <span className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                  No hay filtros activos
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="modal-footer flex-col xs:flex-row gap-2 xs:gap-3">
          <button
            onClick={handleClearFilters}
            className="btn-secondary text-xs xs:text-sm w-full xs:w-auto"
          >
            <i className="fas fa-eraser mr-2"></i>
            Limpiar Filtros
          </button>
          <div className="flex gap-2 xs:gap-3 w-full xs:w-auto">
            <button
              onClick={onClose}
              className="btn-secondary text-xs xs:text-sm flex-1 xs:flex-none"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn-primary text-xs xs:text-sm flex-1 xs:flex-none"
            >
              <i className="fas fa-check mr-2"></i>
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;