const User = require('../models/User');
const QRService = require('../services/qrService');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true }
    ).select('-password');
    
    if (updatedUser) {
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } else {
      res.status(400).json({ message: 'Profile update failed' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profile_image: imageUrl },
      { new: true }
    );
    
    if (updatedUser) {
      res.json({ message: 'Profile image updated successfully', imageUrl });
    } else {
      res.status(400).json({ message: 'Profile image update failed' });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error during image upload' });
  }
};

// @desc    Add or update UPI ID
// @route   PUT /api/users/upi
// @access  Private
const addUpiId = async (req, res) => {
  try {
    const { upiId } = req.body;
    
    if (!upiId) {
      return res.status(400).json({ message: 'Please provide a UPI ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { upi_id: upiId },
      { new: true }
    );
    
    if (updatedUser) {
      res.json({ message: 'UPI ID updated successfully', upiId });
    } else {
      res.status(400).json({ message: 'UPI ID update failed' });
    }
  } catch (error) {
    console.error('Update UPI error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Generate QR code for user's UPI
// @route   GET /api/users/qr
// @access  Private
const generateQR = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.upi_id) {
      return res.status(400).json({ message: 'UPI ID is required to generate QR code. Please add one first.' });
    }

    const qrCodeDataUrl = await QRService.generateUpiQR(user.upi_id, user.name);
    
    res.json({ 
      message: 'QR code generated successfully', 
      qrCode: qrCodeDataUrl 
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ message: 'Server error during QR generation' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  addUpiId,
  generateQR
};
