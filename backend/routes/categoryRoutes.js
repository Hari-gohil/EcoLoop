const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// Route: /api/categories
router.get('/', getCategories);

module.exports = router;
