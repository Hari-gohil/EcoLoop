const mongoose = require('mongoose');
const User = require('../models/User');
const WasteItem = require('../models/WasteItem');
const Review = require('../models/Review');
const Category = require('../models/Category');

// Helper to format month number to string
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// @desc    Get all users with their item stats
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'wasteitems',
          localField: '_id',
          foreignField: 'user_id',
          as: 'items'
        }
      },
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          email: 1,
          role: 1,
          points: 1,
          is_blocked: 1,
          created_at: 1,
          item_count: { $size: '$items' }
        }
      },
      { $sort: { created_at: -1 } }
    ]);
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get detailed user profile including waste items
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wasteItems = await WasteItem.find({ user_id: user._id }).sort({ created_at: -1 });

    const response = user.toJSON();
    response.wasteItems = wasteItems.map(w => w.toJSON());

    res.json(response);
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};

// @desc    Toggle block status of a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_blocked: isBlocked },
      { new: true }
    );
    
    if (user) {
      res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } else {
      res.status(400).json({ message: 'Failed to update user block status' });
    }
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user completely
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all waste items
// @route   GET /api/admin/waste-items
// @access  Private/Admin
const getAllWasteItems = async (req, res) => {
  try {
    const items = await WasteItem.find()
      .populate('user_id', 'name email profile_image')
      .sort({ created_at: -1 });
      
    const formattedItems = items.map(item => {
      const obj = item.toJSON();
      if (obj.user_id) {
        obj.user_name = obj.user_id.name;
        obj.user_email = obj.user_id.email;
        obj.user_id = obj.user_id.id;
      }
      return obj;
    });

    res.json(formattedItems);
  } catch (error) {
    console.error('Get waste items error:', error);
    res.status(500).json({ message: 'Server error fetching waste items' });
  }
};

// @desc    Delete a waste item
// @route   DELETE /api/admin/waste-items/:id
// @access  Private/Admin
const deleteWasteItem = async (req, res) => {
  try {
    const item = await WasteItem.findByIdAndDelete(req.params.id);
    if (item) {
      res.json({ message: 'Waste item deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete waste item' });
    }
  } catch (error) {
    console.error('Delete waste item error:', error);
    res.status(500).json({ message: 'Server error deleting waste item' });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeItems = await WasteItem.countDocuments({ status: 'available' });
    const exchangedItems = await WasteItem.countDocuments({ status: 'exchanged' });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowthAgg = await User.aggregate([
      { $match: { role: 'user', created_at: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const userGrowth = userGrowthAgg.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    const exchangeGrowthAgg = await WasteItem.aggregate([
      { $match: { status: 'exchanged', created_at: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const exchangeGrowth = exchangeGrowthAgg.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    res.json({
      counters: { totalUsers, activeItems, exchangedItems },
      userGrowth,
      exchangeGrowth
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('reviewer_id', 'name email profile_image')
      .populate('reviewee_id', 'name email profile_image')
      .populate('waste_id', 'title')
      .sort({ created_at: -1 });

    const formattedReviews = reviews.map(r => {
      const obj = r.toJSON();
      if (obj.reviewer_id) {
        obj.sender_name = obj.reviewer_id.name;
        obj.sender_email = obj.reviewer_id.email;
        obj.reviewer_id = obj.reviewer_id.id;
      }
      if (obj.reviewee_id) {
        obj.receiver_name = obj.reviewee_id.name;
        obj.receiver_email = obj.reviewee_id.email;
        obj.reviewee_id = obj.reviewee_id.id;
      }
      if (obj.waste_id) {
        obj.waste_title = obj.waste_id.title;
        obj.waste_id = obj.waste_id.id;
      }
      return obj;
    });

    res.json(formattedReviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (review) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete review' });
    }
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

// @desc    Add a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategory = await Category.create({ name });
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Server error adding category' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete category' });
    }
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error deleting category' });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  toggleBlockUser,
  deleteUser,
  getAllWasteItems,
  deleteWasteItem,
  getAnalytics,
  getAllReviews,
  deleteReview,
  addCategory,
  deleteCategory
};
