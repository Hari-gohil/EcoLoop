const QRCode = require('qrcode');

/**
 * Generates a Base64 encoded QR Code data URL from a given text or URL
 * @param {string} data - The string to encode into the QR code
 * @returns {Promise<string>} - The Base64 data URL
 */
const generateQRCode = async (data) => {
  try {
    if (!data) {
      throw new Error('Data is required to generate a QR code');
    }
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = generateQRCode;
