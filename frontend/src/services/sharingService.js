// services/sharingService.js
import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.REACT_APP_SHARING_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const sharingService = {
  async createShare(travelPlanId, accessType) {
    const response = await axios.post(
      `${BASE_URL}/api/sharing`,
      { travelPlanId, accessType },
      getAuthHeaders()
    );
    return response.data;
  },

  async getByToken(token) {
    const response = await axios.get(`${BASE_URL}/api/sharing/${token}`);
    return response.data;
  },

  async deleteShare(token) {
    await axios.delete(`${BASE_URL}/api/sharing/${token}`, getAuthHeaders());
  }
};