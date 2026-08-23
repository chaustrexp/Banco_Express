const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireAdmin);

router.get('/', auditController.getAuditLogs);

module.exports = router;
