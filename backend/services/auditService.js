const db = require('../config/db');

/**
 * Registra una acción de auditoría en la base de datos
 * 
 * @param {Object} params - Parámetros de auditoría
 * @param {number} params.userId - ID del usuario que realizó la acción
 * @param {string} params.action - Nombre de la acción (Ej: 'LOGIN', 'TRANSFERENCIA')
 * @param {string} params.details - Detalles adicionales en formato texto o JSON string
 * @param {string} params.ipAddress - Dirección IP de la solicitud
 */
exports.logAction = async ({ userId, action, details, ipAddress }) => {
  try {
    await db.execute(
      'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [userId || null, action, details || '', ipAddress || 'Unknown']
    );
  } catch (error) {
    // No queremos que un fallo en la auditoría rompa la transacción principal
    // pero sí queremos registrarlo en los logs del servidor
    console.error('Error al registrar en auditoría:', error);
  }
};

/**
 * Obtiene los registros de auditoría (opcionalmente filtrados)
 */
exports.getLogs = async (limit = 100) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `, [limit.toString()]);
    
    return rows;
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    throw error;
  }
};
