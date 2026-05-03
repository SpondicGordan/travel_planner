// services/destinationService.js
import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.REACT_APP_TRAVEL_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const destinationService = {
  async getAll(travelPlanId) {
    const response = await axios.get(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/destinations`,
      getAuthHeaders()
    );
    return response.data;
  },

  async create(travelPlanId, data) {
    const response = await axios.post(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/destinations`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  async update(travelPlanId, id, data) {
    const response = await axios.put(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/destinations/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  async delete(travelPlanId, id) {
    await axios.delete(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/destinations/${id}`,
      getAuthHeaders()
    );
  }
};