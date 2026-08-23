const express = require('express');
const router = express.Router();
const creditsController = require('../controllers/creditsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', requireAdmin, creditsController.getAllCredits);

module.exports = router;
