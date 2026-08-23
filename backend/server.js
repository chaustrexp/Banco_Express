const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const clientsRoutes = require('./routes/clientsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const accountsRoutes = require('./routes/accountsRoutes');
const creditsRoutes = require('./routes/creditsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // Expose io to controllers

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('register', (data) => {
    // data expected: { role: string, email: string }
    if (data.role === 'admin') {
      socket.join('admin_room');
      console.log(`Socket ${socket.id} joined admin_room`);
    } 
    
    // Always join the personal email room if email is provided
    if (data.email) {
      socket.join(`client_${data.email}`);
      console.log(`Socket ${socket.id} joined client_${data.email}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor backend y WebSockets corriendo en http://localhost:${PORT}`);
});
