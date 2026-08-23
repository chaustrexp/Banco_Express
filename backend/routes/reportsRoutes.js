const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireAdmin);

router.get('/:type', reportsController.getReport);

module.exports = router;
