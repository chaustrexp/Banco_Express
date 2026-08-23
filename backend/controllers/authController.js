const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auditService = require('../services/auditService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor provea email y contraseña' });
  }

  try {
    const [users] = await db.execute(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`, 
      [email]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Create JWT Payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Registrar en auditoría
    await auditService.logAction({
      userId: user.id,
      action: 'LOGIN',
      details: 'Inicio de sesión exitoso',
      ipAddress: req.ip
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: payload
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor durante el login' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role, cedula } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Por favor complete todos los campos' });
  }

  try {
    // Check if user exists
    const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Determine role ID
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    if (roles.length === 0) {
      return res.status(400).json({ message: 'Rol inválido' });
    }
    const roleId = roles[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, roleId]
    );

    // If role is user, auto-create client and account
    if (role === 'user') {
      const generatedDNI = cedula || `REG-${Date.now()}`;
      const phone = '0000000000';
      
      const [clientResult] = await db.execute(
        'INSERT INTO clients (dni, name, email, phone, status) VALUES (?, ?, ?, ?, ?)',
        [generatedDNI, name, email, phone, 'Activo']
      );
      const clientId = clientResult.insertId;

      const randomNum = Math.floor(100000000 + Math.random() * 900000000);
      const accountNumber = `550${randomNum}`;

      await db.execute(
        'INSERT INTO accounts (account_number, client_id, balance, type, status) VALUES (?, ?, ?, ?, ?)',
        [accountNumber, clientId, 0.00, 'Ahorros', 'Activa']
      );
    }

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('notification', {
        message: `Nuevo usuario registrado: ${name} (${role})`,
        type: 'success'
      });
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error en el servidor durante el registro' });
  }
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
  }

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email]);

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error en el servidor al cambiar contraseña' });
  }
};
