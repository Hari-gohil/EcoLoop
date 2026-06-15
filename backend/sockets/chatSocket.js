const Chat = require('../models/Chat');
const { sendNotification } = require('../services/notificationService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins their own personal room to receive private messages
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their personal room.`);
    });

    // Handle sending a private message
    socket.on('send_private_message', async (data) => {
      try {
        const { sender_id, receiver_id, message } = data;

        // 1. Save message to Database
        const newMessage = await Chat.create({
          sender_id,
          receiver_id,
          message
        });
        const messageId = newMessage._id;

        // 2. Prepare the message payload to send to the receiver
        const messagePayload = {
          id: messageId,
          sender_id,
          receiver_id,
          message,
          is_read: false,
          created_at: new Date()
        };

        // 3. Emit the message to the receiver's personal room
        io.to(`user_${receiver_id}`).emit('receive_private_message', messagePayload);
        
        // 4. Also emit back to the sender so their UI updates if they are connected on multiple devices
        io.to(`user_${sender_id}`).emit('receive_private_message', messagePayload);

        // 5. Trigger Notification
        await sendNotification(receiver_id, 'New Message', 'You have received a new chat message.');

      } catch (error) {
        console.error('Error sending private message via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
