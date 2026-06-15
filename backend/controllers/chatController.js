const Chat = require('../models/Chat');

const formatChats = (chats) => {
  return chats.map(c => {
    const obj = c.toJSON();
    if (obj.sender_id) {
      obj.sender_name = obj.sender_id.name;
      obj.sender_id = obj.sender_id.id;
    }
    if (obj.receiver_id) {
      obj.receiver_name = obj.receiver_id.name;
      obj.receiver_id = obj.receiver_id.id;
    }
    return obj;
  });
};

// @desc    Get chat history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; // The other user's ID
    const currentUserId = req.user.id;

    // Mark unread messages as read (the ones sent BY the other user TO the current user)
    await Chat.updateMany(
      { sender_id: userId, receiver_id: currentUserId, is_read: false },
      { $set: { is_read: true } }
    );

    const history = await Chat.find({
      $or: [
        { sender_id: currentUserId, receiver_id: userId },
        { sender_id: userId, receiver_id: currentUserId }
      ]
    })
    .populate('sender_id', 'name')
    .populate('receiver_id', 'name')
    .sort({ created_at: 1 });

    res.json(formatChats(history));
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error while fetching chat history' });
  }
};

// @desc    Get all active conversations for the current user
// @route   GET /api/chat/
// @access  Private
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const chats = await Chat.find({
      $or: [{ sender_id: currentUserId }, { receiver_id: currentUserId }]
    })
    .populate('sender_id', 'name profile_image')
    .populate('receiver_id', 'name profile_image')
    .sort({ created_at: -1 });

    const userMap = new Map();
    
    chats.forEach(c => {
      const isSenderMe = c.sender_id && c.sender_id.id === currentUserId;
      const otherUser = isSenderMe ? c.receiver_id : c.sender_id;
      
      if (otherUser && !userMap.has(otherUser.id)) {
        userMap.set(otherUser.id, {
          id: otherUser.id,
          name: otherUser.name,
          profile_image: otherUser.profile_image
        });
      }
    });

    res.json(Array.from(userMap.values()));
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error while fetching conversations' });
  }
};

module.exports = {
  getChatHistory,
  getConversations
};
