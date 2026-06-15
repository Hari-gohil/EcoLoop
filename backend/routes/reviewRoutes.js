const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviews,
  getGivenReviews,
  getUserRating
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/user/:userId', getReviews);
router.get('/given/:userId', getGivenReviews);
router.get('/rating/:userId', getUserRating);

// Protected routes
router.post('/', protect, addReview);

module.exports = router;
