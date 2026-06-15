import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/chat';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('user');
  if (!stored) return { headers: {} };
  const parsed = JSON.parse(stored);
  const token = parsed?.token || parsed?.user?.token || parsed;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

class ChatService {
  // Get all active conversations for the current user
  static async getConversations() {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  }

  // Get chat history with a specific user
  static async getChatHistory(otherUserId) {
    const response = await axios.get(`${API_URL}/${otherUserId}`, getAuthHeaders());
    return response.data;
  }
}

export default ChatService;
