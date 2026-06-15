const User = require('../models/User');
const { sendNotification } = require('./notificationService');

const POINT_VALUES = {
  EXCHANGE: 10,
  DONATION: 15,
  REVIEW: 2
};

class GreenPointService {
  
  // Award points for completing an exchange or donation
  static async awardForExchange(ownerId, requesterId, price) {
    try {
      // If price is 0, it's considered a Donation
      const isDonation = parseFloat(price) === 0;
      const pointsToAward = isDonation ? POINT_VALUES.DONATION : POINT_VALUES.EXCHANGE;
      
      // Award points to the owner (the one giving away the item)
      await User.findByIdAndUpdate(ownerId, { $inc: { points: pointsToAward } });
      
      // Notify the owner
      await sendNotification(
        ownerId, 
        'Points Earned', 
        `You earned ${pointsToAward} Green Points for your successful ${isDonation ? 'donation' : 'exchange'}!`
      );

      // Award a fixed 5 points to the requester for recycling/reusing!
      const requesterPoints = 5;
      await User.findByIdAndUpdate(requesterId, { $inc: { points: requesterPoints } });
      
      // Notify the requester
      await sendNotification(
        requesterId, 
        'Points Earned', 
        `You earned ${requesterPoints} Green Points for keeping items in the circular economy!`
      );

    } catch (error) {
      console.error('Error awarding exchange points:', error);
    }
  }

  // Award points for leaving a review
  static async awardForReview(reviewerId) {
    try {
      const pointsToAward = POINT_VALUES.REVIEW;
      
      // Award points to the reviewer
      await User.findByIdAndUpdate(reviewerId, { $inc: { points: pointsToAward } });
      
      // Notify the reviewer
      await sendNotification(
        reviewerId, 
        'Points Earned', 
        `You earned ${pointsToAward} Green Points for leaving a community review!`
      );
    } catch (error) {
      console.error('Error awarding review points:', error);
    }
  }
}

module.exports = GreenPointService;
