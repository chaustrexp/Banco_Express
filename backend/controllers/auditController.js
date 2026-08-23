const auditService = require('../services/auditService');

exports.getAuditLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await auditService.getLogs(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error in getAuditLogs:', error);
    res.status(500).json({ message: 'Error al obtener registros de auditoría' });
  }
};
