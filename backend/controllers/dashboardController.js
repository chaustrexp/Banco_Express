const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Clientes
    const [clients] = await db.execute('SELECT COUNT(*) as total FROM clients');
    
    // 2. Total Saldos por tipo y porcentaje de cambio mensual
    const [balancesByType] = await db.execute(`
      SELECT a.type, 
             SUM(a.balance) as total,
             (
               SUM(a.balance) / 
               NULLIF(SUM(a.balance) - (
                 SELECT COALESCE(SUM(CASE WHEN t.type = 'Depósito' THEN t.amount ELSE -t.amount END), 0)
                 FROM transactions t
                 JOIN accounts ac ON t.account_id = ac.id
                 WHERE ac.type = a.type AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
               ), 0) - 1
             ) * 100 as monthly_change
      FROM accounts a
      GROUP BY a.type
    `);
    
    // 3. Operaciones de Hoy (o total para simplificar)
    const [transactions] = await db.execute('SELECT COUNT(*) as total FROM transactions');

    // 4. Últimas 5 transacciones
    const [recentTransactions] = await db.execute(`
      SELECT t.id, t.type, t.amount, t.description, t.created_at, c.name as client_name
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      JOIN clients c ON a.client_id = c.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    // 5. Cuentas con mayores saldos
    const [topAccounts] = await db.execute(`
      SELECT a.id, a.account_number, a.balance, c.name as client_name
      FROM accounts a
      JOIN clients c ON a.client_id = c.id
      ORDER BY a.balance DESC
      LIMIT 3
    `);

    res.json({
      totalClients: clients[0].total || 0,
      balancesByType,
      totalOperations: transactions[0].total || 0,
      recentTransactions,
      topAccounts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getChartData = async (req, res) => {
  const { year } = req.query;
  const targetYear = year || new Date().getFullYear();

  try {
    const [rows] = await db.execute(`
      SELECT 
        MONTH(created_at) as month, 
        type, 
        SUM(amount) as total
      FROM transactions 
      WHERE YEAR(created_at) = ?
      GROUP BY MONTH(created_at), type
    `, [targetYear]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
