import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/requests';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('user');
  if (!stored) return { headers: {} };
  const parsed = JSON.parse(stored);
  const token = parsed?.token || parsed?.user?.token || parsed;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

class RequestService {
  // Create a new request for an item
  static async createRequest(requestData) {
    const response = await axios.post(API_URL, requestData, getAuthHeaders());
    return response.data;
  }

  // Get requests made by the user
  static async getMyRequests() {
    const response = await axios.get(`${API_URL}/outgoing`, getAuthHeaders());
    return response.data;
  }

  // Get incoming requests for the user's items
  static async getIncomingRequests() {
    const response = await axios.get(`${API_URL}/incoming`, getAuthHeaders());
    return response.data;
  }

  // Update status of a request (accepted, rejected, completed)
  static async updateRequestStatus(id, status) {
    // Status can be 'accept', 'reject', or 'complete'
    // Map past tense from UI to route actions
    let routeAction = status;
    if (status === 'accepted') routeAction = 'accept';
    if (status === 'rejected') routeAction = 'reject';
    if (status === 'completed') routeAction = 'complete';

    const response = await axios.put(`${API_URL}/${id}/${routeAction}`, {}, getAuthHeaders());
    return response.data;
  }
}

export default RequestService;
