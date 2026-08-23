const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', requireAdmin, accountsController.getAllAccounts);
router.get('/client/:clientId', accountsController.getAccountsByClientId);
router.post('/', requireAdmin, accountsController.createAccount);
router.patch('/:id/status', requireAdmin, accountsController.toggleAccountStatus);

module.exports = router;
