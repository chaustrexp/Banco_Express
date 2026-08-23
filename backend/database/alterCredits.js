const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function createCreditsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'banco_express'
  });

  try {
    console.log('Creando tabla de créditos...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS credits (
          id INT AUTO_INCREMENT PRIMARY KEY,
          credit_number VARCHAR(50) UNIQUE NOT NULL,
          client_id INT NOT NULL,
          type ENUM('Personal', 'Hipotecario', 'Vehículo', 'Empresarial') NOT NULL,
          amount DECIMAL(15, 2) NOT NULL,
          balance DECIMAL(15, 2) NOT NULL,
          interest_rate DECIMAL(5, 2) NOT NULL,
          installments VARCHAR(50) NOT NULL,
          status ENUM('Activo', 'Pagado', 'Mora', 'Vencido') DEFAULT 'Activo',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `);

    // Insertar datos de prueba si está vacía
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM credits');
    if (rows[0].count === 0) {
      console.log('Insertando datos de prueba...');
      await connection.execute(`
        INSERT INTO credits (credit_number, client_id, type, amount, balance, interest_rate, installments, status) VALUES 
        ('CRD1001', 1, 'Personal', 5000000.00, 4500000.00, 15.5, '2/12', 'Activo'),
        ('CRD1002', 2, 'Vehículo', 35000000.00, 20000000.00, 12.0, '24/60', 'Activo'),
        ('CRD1003', 3, 'Hipotecario', 150000000.00, 0.00, 10.5, '120/120', 'Pagado'),
        ('CRD1004', 1, 'Personal', 2000000.00, 1500000.00, 16.0, '3/6', 'Mora')
      `);
    }

    console.log('¡Tabla de créditos lista!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

createCreditsTable();
