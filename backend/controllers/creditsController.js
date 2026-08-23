const db = require('../config/db');

exports.getAllCredits = async (req, res) => {
  try {
    const [credits] = await db.execute(`
      SELECT cr.credit_number as id, cr.type as tipo, cr.amount as monto, 
             cr.balance as saldo, cr.interest_rate as tasaInteres, 
             cr.installments as cuotas, cr.status as estado,
             c.name as cliente, c.dni as cedula
      FROM credits cr
      JOIN clients c ON cr.client_id = c.id
      ORDER BY cr.created_at DESC
    `);
    res.json(credits);
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
