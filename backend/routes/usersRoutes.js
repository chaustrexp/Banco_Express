const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.put('/:id/password', usersController.updatePassword);

module.exports = router;
