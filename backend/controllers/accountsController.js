const db = require('../config/db');

exports.getAllAccounts = async (req, res) => {
  try {
    const [accounts] = await db.execute(`
      SELECT a.id, a.account_number as numero, a.balance as saldo, a.type as tipo, a.status as estado,
             c.name as cliente
      FROM accounts a
      JOIN clients c ON a.client_id = c.id
      ORDER BY a.created_at DESC
    `);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getAccountsByClientId = async (req, res) => {
  const { clientId } = req.params;
  try {
    const [accounts] = await db.execute(`
      SELECT a.id, a.account_number as numero, a.balance as saldo, a.type as tipo, a.status as estado
      FROM accounts a
      WHERE a.client_id = ?
      ORDER BY a.created_at DESC
    `, [clientId]);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts for client:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.createAccount = async (req, res) => {
  const { numero, client_id, tipo, saldo, estado } = req.body;
  const initBalance = parseFloat(saldo) || 0;

  if (!numero || !client_id || !tipo) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO accounts (account_number, client_id, balance, type, status) VALUES (?, ?, ?, ?, ?)',
      [numero, client_id, initBalance, tipo, estado || 'Activa']
    );

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('notification', {
        message: `Nueva cuenta ${tipo} creada (*${numero.toString().slice(-4)})`,
        type: 'info'
      });
    }

    res.status(201).json({ message: 'Cuenta creada exitosamente', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El número de cuenta ya existe' });
    }
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.toggleAccountStatus = async (req, res) => {
  const accountId = req.params.id;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: 'Se requiere el estado' });
  }

  try {
    await db.execute('UPDATE accounts SET status = ? WHERE id = ?', [estado, accountId]);
    res.json({ message: 'Estado de la cuenta actualizado exitosamente' });
  } catch (error) {
    console.error('Error toggling account status:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
