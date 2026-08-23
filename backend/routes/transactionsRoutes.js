const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', requireAdmin, transactionsController.getAllTransactions);
router.get('/type/:type', requireAdmin, transactionsController.getTransactionsByType);
router.get('/client/:clientId', transactionsController.getTransactionsByClientId);
router.post('/', transactionsController.createTransaction);
router.post('/transfer', transactionsController.createTransfer);

module.exports = router;
