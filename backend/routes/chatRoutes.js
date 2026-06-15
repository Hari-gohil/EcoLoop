const express = require('express');
const router = express.Router();
const { getChatHistory, getConversations } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All chat routes require authentication
router.use(protect);

// Get list of active conversations
router.get('/', getConversations);

// Get chat history with a specific user
router.get('/:userId', getChatHistory);

module.exports = router;
