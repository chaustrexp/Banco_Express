const db = require('../config/db');

// GET /api/clients
exports.getAllClients = async (req, res) => {
  try {
    const [clients] = await db.execute(`
      SELECT c.id, c.dni as cedula, c.name as nombre, c.email, c.phone as telefono, c.status as estado, 
             DATE_FORMAT(c.created_at, '%Y-%m-%d') as fechaRegistro,
             COALESCE(SUM(a.balance), 0) as saldo
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// GET /api/clients/email/:email
exports.getClientByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [clients] = await db.execute(`
      SELECT c.id, c.dni as cedula, c.name as nombre, c.email, c.phone as telefono, c.status as estado
      FROM clients c
      WHERE c.email = ?
    `, [email]);
    
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(clients[0]);
  } catch (error) {
    console.error('Error fetching client by email:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// POST /api/clients
exports.createClient = async (req, res) => {
  const { cedula, nombre, email, telefono, estado, saldo } = req.body;
  const initialBalance = parseFloat(saldo) || 0;

  try {
    // 1. Insert Client
    const [result] = await db.execute(
      'INSERT INTO clients (dni, name, email, phone, status) VALUES (?, ?, ?, ?, ?)',
      [cedula, nombre, email, telefono, estado || 'Activo']
    );
    
    const clientId = result.insertId;

    // 2. Create initial savings account
    // Generate a random 12-digit account number starting with 550
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    const accountNumber = `550${randomNum}`;

    await db.execute(
      'INSERT INTO accounts (account_number, client_id, balance, type, status) VALUES (?, ?, ?, ?, ?)',
      [accountNumber, clientId, initialBalance, 'Ahorros', 'Activa']
    );

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('notification', {
        message: `Nuevo cliente registrado: ${nombre}`,
        type: 'success'
      });
    }

    res.status(201).json({ message: 'Cliente creado exitosamente', clientId });
  } catch (error) {
    console.error('Error creating client:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Ya existe un cliente con esa cédula o email' });
    } else {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

// PUT /api/clients/:id (we use DNI as ID in the frontend mostly, but let's support DNI)
exports.updateClient = async (req, res) => {
  const { cedula } = req.params;
  const { nombre, email, telefono, estado } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE clients SET name = ?, email = ?, phone = ?, status = ? WHERE dni = ?',
      [nombre, email, telefono, estado, cedula]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// DELETE /api/clients/:id
exports.deleteClient = async (req, res) => {
  const { cedula } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM clients WHERE dni = ?', [cedula]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('notification', {
        message: `Cliente con cédula ${cedula} eliminado`,
        type: 'warning'
      });
    }

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
