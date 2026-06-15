const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Route: /api/auth/register
router.post('/register', register);

// Route: /api/auth/register-admin
router.post('/register-admin', require('../controllers/authController').registerAdmin);

// Route: /api/auth/login
router.post('/login', login);

// Route: /api/auth/me (Protected Route)
router.get('/me', protect, getMe);

module.exports = router;
