import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/api';

const AuditSection = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('Todas');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await apiFetch('http://localhost:5001/api/audit?limit=200');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        console.error('Error fetching audit logs');
      }
    } catch (error) {
      console.error('Network error', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = filterAction === 'Todas' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = ['Todas', ...new Set(logs.map(l => l.action))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-shield-alt text-primary-600"></i>
            Auditoría del Sistema
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Registro de actividades críticas e inmutables del sistema.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar por usuario o detalles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white appearance-none"
              >
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="pb-3 font-medium px-4">Fecha</th>
                  <th className="pb-3 font-medium px-4">Usuario</th>
                  <th className="pb-3 font-medium px-4">Acción</th>
                  <th className="pb-3 font-medium px-4">Detalles</th>
                  <th className="pb-3 font-medium px-4">IP</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('es-CO')}
                    </td>
                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-medium">
                      {log.user_name || 'Sistema'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-500 text-xs font-mono">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
                
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron registros de auditoría que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditSection;
