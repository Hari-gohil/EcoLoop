const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  uploadProfileImage, 
  addUpiId, 
  generateQR 
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route: /api/users/profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Route: /api/users/profile-image
// upload.single('profileImage') expects the form-data key to be 'profileImage'
router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Route: /api/users/upi
router.put('/upi', protect, addUpiId);

// Route: /api/users/qr
router.get('/qr', protect, generateQR);

module.exports = router;
