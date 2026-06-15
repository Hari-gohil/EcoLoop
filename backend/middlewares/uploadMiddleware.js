const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the main uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Optionally create subdirectories for better organization
const dirs = ['profiles', 'waste', 'payments'];
dirs.forEach(dir => {
  const dirPath = path.join(uploadDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dynamically assign destination based on the field name in the form data
    let folder = 'uploads/';
    
    if (file.fieldname === 'profileImage') {
      folder = 'uploads/profiles/';
    } else if (file.fieldname === 'wasteImage') {
      folder = 'uploads/waste/';
    } else if (file.fieldname === 'paymentScreenshot') {
      folder = 'uploads/payments/';
    } else {
      // Fallback for generic 'image' field used in some routes
      folder = 'uploads/';
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Rename file to: [userId]-[timestamp].[extension]
    const userId = req.user ? req.user.id : 'guest';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to accept ONLY images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  // Check extension
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only Images (JPEG, JPG, PNG, WEBP) are allowed!'), false);
  }
};

// Create the upload middleware instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

module.exports = upload;
