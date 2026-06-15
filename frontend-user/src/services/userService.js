import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

// Helper to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };
};

class UserService {
  // Get user profile
  static async getProfile() {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
  }

  // Update profile
  static async updateProfile(profileData) {
    const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeaders());
    return response.data;
  }

  // Upload profile image
  static async uploadImage(formData) {
    const options = getAuthHeaders();
    options.headers['Content-Type'] = 'multipart/form-data';
    const response = await axios.post(`${API_URL}/profile-image`, formData, options);
    return response.data;
  }

  // Add/Update UPI ID
  static async updateUpiId(upiData) {
    const response = await axios.put(`${API_URL}/upi`, upiData, getAuthHeaders());
    return response.data;
  }

  // Fetch QR Code Base64 Image
  static async getQRCode() {
    const response = await axios.get(`${API_URL}/qr`, getAuthHeaders());
    return response.data; // { message, qrCode: 'data:image/png;base64,...' }
  }
}

export default UserService;
