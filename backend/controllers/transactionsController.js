const db = require('../config/db');
const auditService = require('../services/auditService');

exports.getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await db.execute(`
      SELECT t.id, t.type as tipo, t.amount as monto, t.description as descripcion, 
             DATE_FORMAT(t.created_at, '%Y-%m-%d') as fecha,
             'Completado' as estado,
             c.name as cliente, a.account_number as cuenta
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      JOIN clients c ON a.client_id = c.id
      ORDER BY t.created_at DESC
    `);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getTransactionsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const [transactions] = await db.execute(`
      SELECT t.id, t.type as tipo, t.amount as monto, t.description as descripcion, 
             DATE_FORMAT(t.created_at, '%Y-%m-%d') as fecha,
             'Completado' as estado,
             c.name as cliente, a.account_number as cuenta
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      JOIN clients c ON a.client_id = c.id
      WHERE t.type = ?
      ORDER BY t.created_at DESC
    `, [type]);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by type:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getTransactionsByClientId = async (req, res) => {
  const { clientId } = req.params;
  try {
    const [transactions] = await db.execute(`
      SELECT t.id, t.type as tipo, t.amount as monto, t.description as descripcion, 
             DATE_FORMAT(t.created_at, '%Y-%m-%d') as fecha,
             'Completado' as estado,
             c.name as cliente, a.account_number as cuenta
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      JOIN clients c ON a.client_id = c.id
      WHERE c.id = ?
      ORDER BY t.created_at DESC
    `, [clientId]);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions for client:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.createTransaction = async (req, res) => {
  const { cuenta, tipo, monto, descripcion } = req.body;
  const amount = parseFloat(monto);

  if (!cuenta || !tipo || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  // Use a MySQL transaction to ensure consistency
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get the account ID and current balance
    const [accounts] = await connection.execute(
      'SELECT id, balance FROM accounts WHERE account_number = ? FOR UPDATE',
      [cuenta]
    );

    if (accounts.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    const account = accounts[0];
    let newBalance = parseFloat(account.balance);

    // 2. Validate and calculate new balance
    // Tipo: 'Depósito', 'Retiro', 'Transferencia', 'Pago'
    if (tipo === 'Retiro' || tipo === 'Pago') {
      if (newBalance < amount) {
        throw new Error('Saldo insuficiente');
      }
      newBalance -= amount;
    } else if (tipo === 'Depósito' || tipo === 'Transferencia') {
      newBalance += amount;
    } else {
      throw new Error('Tipo de transacción inválido');
    }

    // 3. Update Account Balance
    await connection.execute(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, account.id]
    );

    // 4. Insert Transaction Record
    await connection.execute(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [account.id, tipo, amount, descripcion || '']
    );

    await connection.commit();
    
    // Registrar en auditoría
    if (req.user) {
      await auditService.logAction({
        userId: req.user.id,
        action: tipo.toUpperCase(),
        details: `Cuenta: ${cuenta}, Monto: $${amount}`,
        ipAddress: req.ip
      });
    }
    
    // Emit real-time notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('notification', {
        message: `Nueva transacción (${tipo}) por $${amount.toLocaleString('es-CO')}`,
        type: 'info'
      });
    }

    res.status(201).json({ message: 'Transacción completada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Transaction Error:', error);
    res.status(400).json({ message: error.message || 'Error al procesar transacción' });
  } finally {
    connection.release();
  }
};

exports.createTransfer = async (req, res) => {
  const { cuentaOrigen, cuentaDestino, monto, descripcion } = req.body;
  const amount = parseFloat(monto);

  if (!cuentaOrigen || !cuentaDestino || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  if (cuentaOrigen === cuentaDestino) {
    return res.status(400).json({ message: 'La cuenta origen y destino no pueden ser iguales' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Límite diario de $10.000.000 para transferencias
    const [todayTransfers] = await connection.execute(
      `SELECT COALESCE(SUM(amount), 0) as total_today 
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.account_number = ? AND t.type = 'Transferencia' AND DATE(t.created_at) = CURDATE()`,
      [cuentaOrigen]
    );

    const totalToday = parseFloat(todayTransfers[0].total_today);
    if (totalToday + amount > 10000000) {
      throw new Error(`El límite diario de transferencias es de $10,000,000. Llevas acumulado $${totalToday.toLocaleString('es-CO')}`);
    }

    // 1. Validate both accounts and get email for destination
    const [accounts] = await connection.execute(
      `SELECT a.id, a.account_number, a.balance, a.status, c.name as client_name, c.email as client_email
       FROM accounts a 
       JOIN clients c ON a.client_id = c.id 
       WHERE a.account_number IN (?, ?) FOR UPDATE`,
      [cuentaOrigen, cuentaDestino]
    );

    if (accounts.length !== 2) {
      throw new Error('Una o ambas cuentas no fueron encontradas');
    }

    const sourceAccount = accounts.find(a => a.account_number === cuentaOrigen);
    const destAccount = accounts.find(a => a.account_number === cuentaDestino);

    if (!sourceAccount || !destAccount) {
      throw new Error('No se pudo identificar origen y destino');
    }

    if (sourceAccount.status !== 'Activa' || destAccount.status !== 'Activa') {
      throw new Error('Una de las cuentas no está activa');
    }

    let sourceBalance = parseFloat(sourceAccount.balance);
    let destBalance = parseFloat(destAccount.balance);

    if (sourceBalance < amount) {
      throw new Error('Saldo insuficiente en la cuenta de origen');
    }

    // 2. Update balances
    sourceBalance -= amount;
    destBalance += amount;

    await connection.execute(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [sourceBalance, sourceAccount.id]
    );

    await connection.execute(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [destBalance, destAccount.id]
    );

    // 3. Insert transaction records
    const txDescription = descripcion || 'Transferencia';
    
    await connection.execute(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [sourceAccount.id, 'Transferencia', amount, 'Enviado a ' + destAccount.client_name + ' (' + cuentaDestino + ') - ' + txDescription]
    );

    await connection.execute(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [destAccount.id, 'Depósito', amount, 'Recibido de ' + sourceAccount.client_name + ' (' + cuentaOrigen + ') - ' + txDescription]
    );

    await connection.execute('COMMIT');

    // Registrar en auditoría
    if (req.user) {
      await auditService.logAction({
        userId: req.user.id,
        action: 'TRANSFERENCIA',
        details: `Origen: ${cuentaOrigen}, Destino: ${cuentaDestino}, Monto: $${amount}`,
        ipAddress: req.ip
      });
    }

    // Emit real-time notification to admin and destination client
    const io = req.app.get('io');
    if (io) {
      // Notify admin
      io.to('admin_room').emit('notification', {
        message: `Nueva transferencia de ${sourceAccount.client_name} a ${destAccount.client_name} por $${amount.toLocaleString('es-CO')}`,
        type: 'info'
      });
      
      // Notify destination client
      if (destAccount.client_email) {
        io.to(`client_${destAccount.client_email}`).emit('notification', {
          message: `Has recibido una transferencia de ${sourceAccount.client_name} por $${amount.toLocaleString('es-CO')}`,
          type: 'success'
        });
      }
    }

    res.status(201).json({ 
      message: 'Transferencia completada exitosamente',
      destClientName: destAccount.client_name
    });

  } catch (error) {
    await connection.execute('ROLLBACK');
    console.error('Transfer Error:', error);
    res.status(400).json({ message: error.message || 'Error al procesar transferencia' });
  } finally {
    connection.release();
  }
};
