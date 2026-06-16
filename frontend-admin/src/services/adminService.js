import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all users
const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

// Get specific user details
const getUserDetails = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
  return response.data;
};

// Toggle user block status
const toggleBlockStatus = async (userId, isBlocked) => {
  const response = await axios.put(`${API_URL}/users/${userId}/block`, { isBlocked }, getAuthHeaders());
  return response.data;
};

// Delete user permanently
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
  return response.data;
};

// Get all waste items
const getAllWasteItems = async () => {
  const response = await axios.get(`${API_URL}/waste-items`, getAuthHeaders());
  return response.data;
};

// Delete a waste item completely
const deleteWasteItem = async (itemId) => {
  const response = await axios.delete(`${API_URL}/waste-items/${itemId}`, getAuthHeaders());
  return response.data;
};

// Get analytics
const getAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`, getAuthHeaders());
  return response.data;
};

// Get all reviews
const getAllReviews = async () => {
  const response = await axios.get(`${API_URL}/reviews`, getAuthHeaders());
  return response.data;
};

// Delete a review
const deleteReview = async (id) => {
  const response = await axios.delete(`${API_URL}/reviews/${id}`, getAuthHeaders());
  return response.data;
};

// Get all categories
const getCategories = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`); // public endpoint
  return response.data;
};

// Add a category
const addCategory = async (name) => {
  const response = await axios.post(`${API_URL}/categories`, { name }, getAuthHeaders());
  return response.data;
};

// Delete a category
const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, getAuthHeaders());
  return response.data;
};

// Get admin profile
const getProfile = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, getAuthHeaders());
  return response.data;
};

// Update admin profile
const updateProfile = async (profileData) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, profileData, getAuthHeaders());
  return response.data;
};

const adminService = {
  getAllUsers,
  getUserDetails,
  toggleBlockStatus,
  deleteUser,
  getAllWasteItems,
  deleteWasteItem,
  getAnalytics,
  getAllReviews,
  deleteReview,
  getCategories,
  addCategory,
  deleteCategory,
  getProfile,
  updateProfile
};

export default adminService;
