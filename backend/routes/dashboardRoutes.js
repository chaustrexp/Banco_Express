const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireAdmin);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/chart?year=2026
router.get('/chart', dashboardController.getChartData);

module.exports = router;
