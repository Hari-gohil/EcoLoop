const generateQRCode = require('../utils/generateQRCode');

class QRService {
  /**
   * Generates a standard Indian UPI payment string and creates a QR code from it
   * @param {string} upiId - The user's UPI ID
   * @param {string} payeeName - The user's name
   * @returns {Promise<string>} - Base64 Data URL of the QR code
   */
  static async generateUpiQR(upiId, payeeName) {
    if (!upiId) {
      throw new Error('UPI ID is required to generate a payment QR code');
    }
    
    // Standard UPI string format
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName || 'User')}`;
    
    // Generate and return the QR code
    return await generateQRCode(upiString);
  }

  // You can easily add more QR features here later, such as:
  // static async generateProfileShareQR(profileUrl) { ... }
  // static async generateWasteItemQR(itemId) { ... }
}

module.exports = QRService;
