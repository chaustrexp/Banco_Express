const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', requireAdmin, clientsController.getAllClients);
router.get('/email/:email', clientsController.getClientByEmail);
router.post('/', requireAdmin, clientsController.createClient);
router.put('/:cedula', requireAdmin, clientsController.updateClient);
router.delete('/:cedula', requireAdmin, clientsController.deleteClient);

module.exports = router;
