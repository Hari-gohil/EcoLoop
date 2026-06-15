const express = require('express');
const router = express.Router();
const {
  createWaste,
  getAllWaste,
  getSingleWaste,
  updateWaste,
  deleteWaste
} = require('../controllers/wasteController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getAllWaste);
router.get('/:id', getSingleWaste);

// Protected routes (require user login)
router.post('/', protect, upload.single('wasteImage'), createWaste);
router.put('/:id', protect, updateWaste);
router.delete('/:id', protect, deleteWaste);

module.exports = router;
