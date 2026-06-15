import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/waste';

// Helper to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };
};

class WasteService {
  // Get all waste items
  static async getAllWaste() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  // Get a single waste item by ID
  static async getWasteById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  // Create new waste item (FormData because of image upload)
  static async createWaste(formData) {
    const options = getAuthHeaders();
    options.headers['Content-Type'] = 'multipart/form-data';
    const response = await axios.post(API_URL, formData, options);
    return response.data;
  }

  // Update waste item
  static async updateWaste(id, updateData) {
    const response = await axios.put(`${API_URL}/${id}`, updateData, getAuthHeaders());
    return response.data;
  }

  // Delete waste item
  static async deleteWaste(id) {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  }
}

export default WasteService;
