const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserDetails, 
  toggleBlockUser, 
  deleteUser,
  getAllWasteItems,
  deleteWasteItem,
  getAnalytics
} = require('../controllers/adminController');
const { adminProtect } = require('../middlewares/adminMiddleware');

// Route: /api/admin/analytics
router.get('/analytics', adminProtect, getAnalytics);

// Route: /api/admin/users
router.get('/users', adminProtect, getAllUsers);
router.get('/users/:id', adminProtect, getUserDetails);
router.put('/users/:id/block', adminProtect, toggleBlockUser);
router.delete('/users/:id', adminProtect, deleteUser);

// Route: /api/admin/waste-items
router.get('/waste-items', adminProtect, getAllWasteItems);
router.delete('/waste-items/:id', adminProtect, deleteWasteItem);

// Route: /api/admin/reviews
const { 
  getAllReviews, 
  deleteReview,
  addCategory,
  deleteCategory
} = require('../controllers/adminController');
router.get('/reviews', adminProtect, getAllReviews);
router.delete('/reviews/:id', adminProtect, deleteReview);

// Route: /api/admin/categories
router.post('/categories', adminProtect, addCategory);
router.delete('/categories/:id', adminProtect, deleteCategory);

module.exports = router;
