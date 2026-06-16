const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Route: /api/auth/register (Navo user banavva mate)
router.post('/register', register);

// Route: /api/auth/register-admin (Navo admin banavva mate)
router.post('/register-admin', require('../controllers/authController').registerAdmin);

// Route: /api/auth/login (Login karva mate)
router.post('/login', login);

// Route: /api/auth/me (Protected Route - Login karela user ni details mate)
router.get('/me', protect, getMe);

module.exports = router;
