import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/reviews';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('user');
  if (!stored) return { headers: {} };
  const parsed = JSON.parse(stored);
  const token = parsed?.token || parsed?.user?.token || parsed;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

class ReviewService {
  // Add a review
  static async addReview(reviewData) {
    const response = await axios.post(API_URL, reviewData, getAuthHeaders());
    return response.data;
  }

  // Get all reviews for a specific user (Reviews received)
  static async getReviews(userId) {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  }

  // Get all reviews given by a specific user
  static async getGivenReviews(userId) {
    const response = await axios.get(`${API_URL}/given/${userId}`);
    return response.data;
  }

  // Get user's average rating
  static async getUserRating(userId) {
    const response = await axios.get(`${API_URL}/rating/${userId}`);
    return response.data;
  }
}

export default ReviewService;
