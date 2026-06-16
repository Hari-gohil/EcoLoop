const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Aa middleware check karse ke user pass valid token che ke nahi (Login che ke nahi)
const protect = async (req, res, next) => {
  let token;

  // Header ma Bearer token hovu joiye
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 'Bearer {token}' mathi khali token levva mate
      token = req.headers.authorization.split(' ')[1];
      
      // Token ne verify karva mate (Check karse ke token sacho che ke khoto)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token mathi user ni ID malse, e ID par thi user ni details database mathi levani (password vagar)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' }); // Jo user na male to
      }

      if (user.is_blocked) {
        return res.status(401).json({ message: 'Not authorized, user is blocked' }); // Jo user blocked hoy to
      }

      req.user = user; // Request ma user object aapi didho jethi aagal na function vapari shake
      next(); // Badhu barabar che, have aagal nu function chalavo
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' }); // Jo token expire thai gayo hoy athva khoto hoy
    }
  }

  // Jo token j na hoy to error aapshe
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
