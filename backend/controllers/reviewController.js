const mongoose = require('mongoose');
const Review = require('../models/Review');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');
const GreenPointService = require('../services/greenPointService');

// @desc    Add a review for a user
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { reviewee_id, waste_id, rating, comment } = req.body;
    const reviewer_id = req.user.id;

    if (!reviewee_id || !rating) {
      return res.status(400).json({ message: 'Reviewee ID and rating are required' });
    }

    if (reviewer_id.toString() === reviewee_id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (waste_id) {
      const existingReview = await Review.findOne({ reviewer_id, reviewee_id, waste_id });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this user for this exchange' });
      }
    }

    const newReview = await Review.create({
      reviewer_id,
      reviewee_id,
      waste_id: waste_id || null,
      rating,
      comment
    });

    await sendNotification(
      reviewee_id,
      'Review Added',
      `${req.user.name || 'Someone'} left you a ${rating}-star review!`
    );

    await GreenPointService.awardForReview(reviewer_id);

    res.status(201).json({ message: 'Review added successfully', reviewId: newReview._id });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

const formatReviews = (reviews) => {
  return reviews.map(rev => {
    const obj = rev.toJSON();
    if (obj.reviewer_id) {
      obj.reviewer_name = obj.reviewer_id.name;
      obj.reviewer_image = obj.reviewer_id.profile_image;
      obj.reviewer_id = obj.reviewer_id.id;
    }
    if (obj.waste_id) {
      obj.waste_title = obj.waste_id.title;
      obj.waste_id = obj.waste_id.id;
    }
    return obj;
  });
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee_id: req.params.userId })
      .populate('reviewer_id', 'name profile_image')
      .populate('waste_id', 'title')
      .sort({ created_at: -1 });
    res.json(formatReviews(reviews));
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews given by a specific user
// @route   GET /api/reviews/given/:userId
// @access  Public
const getGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer_id: req.params.userId })
      .populate('reviewer_id', 'name profile_image') // populate reviewer even though we know it, just to match format
      .populate('waste_id', 'title')
      .sort({ created_at: -1 });
    res.json(formatReviews(reviews));
  } catch (error) {
    console.error('Get given reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching given reviews' });
  }
};

// @desc    Get user's average rating
// @route   GET /api/reviews/rating/:userId
// @access  Public
const getUserRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { reviewee_id: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: null, average_rating: { $avg: '$rating' }, total_reviews: { $sum: 1 } } }
    ]);
    
    if (result.length > 0) {
      res.json({
        averageRating: result[0].average_rating.toFixed(1),
        totalReviews: result[0].total_reviews
      });
    } else {
      res.json({ averageRating: 0, totalReviews: 0 });
    }
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ message: 'Server error while fetching user rating' });
  }
};

module.exports = {
  addReview,
  getReviews,
  getGivenReviews,
  getUserRating
};
