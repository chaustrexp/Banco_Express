const db = require('../config/db');

exports.getReport = async (req, res) => {
  const type = req.params.type;

  try {
    let data = {};

    if (type === 'financial') {
      const [[{ totalDeposits }]] = await db.execute("SELECT COALESCE(SUM(amount), 0) as totalDeposits FROM transactions WHERE type = 'Depósito'");
      const [[{ totalWithdrawals }]] = await db.execute("SELECT COALESCE(SUM(amount), 0) as totalWithdrawals FROM transactions WHERE type IN ('Retiro', 'Pago')");
      const [[{ totalAccounts }]] = await db.execute("SELECT COALESCE(SUM(balance), 0) as totalAccounts FROM accounts");
      const [[{ totalCredits }]] = await db.execute("SELECT COALESCE(SUM(balance), 0) as totalCredits FROM credits");
      
      data = {
        totalDeposits: parseFloat(totalDeposits),
        totalWithdrawals: parseFloat(totalWithdrawals),
        netFlow: parseFloat(totalDeposits) - parseFloat(totalWithdrawals),
        totalAccounts: parseFloat(totalAccounts),
        totalCredits: parseFloat(totalCredits),
        totalAssets: parseFloat(totalAccounts) + parseFloat(totalCredits)
      };

    } else if (type === 'clients') {
      const [[{ totalClients }]] = await db.execute("SELECT COUNT(*) as totalClients FROM clients");
      
      const [statusRows] = await db.execute("SELECT status, COUNT(*) as count FROM clients GROUP BY status");
      const clientsByStatus = statusRows.reduce((acc, row) => ({ ...acc, [row.status]: row.count }), {});

      const [[{ totalAccounts }]] = await db.execute("SELECT COALESCE(SUM(balance), 0) as totalAccounts FROM accounts");
      const avgBalance = totalClients > 0 ? parseFloat(totalAccounts) / totalClients : 0;

      const [topClients] = await db.execute(`
        SELECT c.id, c.name as nombre, c.dni as cedula, COALESCE(SUM(a.balance), 0) as saldo
        FROM clients c
        LEFT JOIN accounts a ON c.id = a.client_id
        GROUP BY c.id
        ORDER BY saldo DESC
        LIMIT 5
      `);

      data = {
        totalClients,
        clientsByStatus,
        avgBalance,
        topClients
      };

    } else if (type === 'transactions') {
      const [[{ totalTransactions, totalVolume }]] = await db.execute("SELECT COUNT(*) as totalTransactions, COALESCE(SUM(amount), 0) as totalVolume FROM transactions");
      
      const [typeRows] = await db.execute("SELECT type, COUNT(*) as count FROM transactions GROUP BY type");
      const transactionsByType = typeRows.reduce((acc, row) => ({ ...acc, [row.type]: row.count }), {});

      const transactionsByStatus = { "Completado": totalTransactions }; // For now all are completed

      data = {
        totalTransactions,
        transactionsByType,
        transactionsByStatus,
        totalVolume: parseFloat(totalVolume)
      };

    } else if (type === 'credits') {
      const [[{ totalCredits, totalAmount, totalBalance }]] = await db.execute("SELECT COUNT(*) as totalCredits, COALESCE(SUM(amount), 0) as totalAmount, COALESCE(SUM(balance), 0) as totalBalance FROM credits");
      
      const [typeRows] = await db.execute("SELECT type, COUNT(*) as count FROM credits GROUP BY type");
      const creditsByType = typeRows.reduce((acc, row) => ({ ...acc, [row.type]: row.count }), {});

      const [statusRows] = await db.execute("SELECT status, COUNT(*) as count FROM credits GROUP BY status");
      const creditsByStatus = statusRows.reduce((acc, row) => ({ ...acc, [row.status]: row.count }), {});

      data = {
        totalCredits,
        creditsByType,
        creditsByStatus,
        totalAmount: parseFloat(totalAmount),
        totalBalance: parseFloat(totalBalance)
      };

    } else {
      return res.status(400).json({ message: 'Tipo de reporte inválido' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error en el servidor al generar reporte' });
  }
};
