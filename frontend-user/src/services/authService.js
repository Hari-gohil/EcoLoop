import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth';

class AuthService {
  // Register user
  static async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  // Login user
  static async login(userData) {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  // Logout user
  static logout() {
    localStorage.removeItem('user');
  }

  // Get current user data using token
  static async getMe() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  }
}

export default AuthService;
