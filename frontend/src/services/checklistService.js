// services/checklistService.js
import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.REACT_APP_TRAVEL_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const checklistService = {
  async getAll(travelPlanId) {
    const response = await axios.get(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/checklist`,
      getAuthHeaders()
    );
    return response.data;
  },

  async create(travelPlanId, text) {
    const response = await axios.post(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/checklist`,
      { text },
      getAuthHeaders()
    );
    return response.data;
  },

  async toggle(travelPlanId, id, isCompleted) {
    const response = await axios.patch(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/checklist/${id}`,
      { isCompleted },
      getAuthHeaders()
    );
    return response.data;
  },

  async delete(travelPlanId, id) {
    await axios.delete(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/checklist/${id}`,
      getAuthHeaders()
    );
  }
};