const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// PUT /api/auth/change-password
router.put('/change-password', authController.changePassword);

module.exports = router;
