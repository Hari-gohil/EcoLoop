const Notification = require('../models/Notification');
const { getIo } = require('../sockets/notificationSocket');

class NotificationService {
  // Central helper function to create and emit notifications
  static async sendNotification(user_id, type, message) {
    try {
      // 1. Save to Database
      const newNotification = await Notification.create({ user_id, type, message });
      
      // 2. Prepare payload
      const notificationPayload = newNotification.toJSON();

      // 3. Emit real-time socket event
      const io = getIo();
      if (io) {
        io.to(`user_${user_id}`).emit('new_notification', notificationPayload);
      }
      
      return newNotification._id;
    } catch (error) {
      console.error('Error sending notification via service:', error);
    }
  }
}

module.exports = NotificationService;
