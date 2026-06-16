const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token banavva mate (jethi user login rahi shake)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // 30 divas pachi token expire thase
  });
};

// @desc    Navo user register karva mate (Sign up)
// @route   POST /api/auth/register
// @access  Public (Koi pan banavi shake)
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' }); // Jo email pahela thi hase to error aapshe
    }

    const salt = await bcrypt.genSalt(10); // Password ne safe banavva mate salt banavyo
    const hashedPassword = await bcrypt.hash(password, salt); // Password ne hash (encrypt) kariyu

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Navo admin register karva mate
// @route   POST /api/auth/register-admin
// @access  Public (Pan secret key jaruri che)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    const expectedSecret = process.env.ADMIN_REGISTER_SECRET || 'supersecret_ecoloop_admin';
    if (adminSecret !== expectedSecret) {
      return res.status(403).json({ message: 'Invalid admin registration secret' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    if (admin) {
      res.status(201).json({
        message: 'Admin registered successfully',
        user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid data received' });
    }
  } catch (error) {
    console.error('Admin Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    User ne login karavva mate
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Password check karse database sathe

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' }); // Jo password khoto hoy to
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: 'Your account has been blocked by the administrator.' }); // Jo admin a block karyo hoy to
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Jene login karyu che eni details levva mate (Profile)
// @route   GET /api/auth/me
// @access  Private (Khali login karelo user j joi shake)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  registerAdmin,
  login,
  getMe,
};
