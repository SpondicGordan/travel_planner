// services/expenseService.js
import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.REACT_APP_TRAVEL_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const expenseService = {
  async getAll(travelPlanId) {
    const response = await axios.get(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/expenses`,
      getAuthHeaders()
    );
    return response.data;
  },

  async getBudgetSummary(travelPlanId) {
    const response = await axios.get(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/expenses/budget-summary`,
      getAuthHeaders()
    );
    return response.data;
  },

  async create(travelPlanId, data) {
    const response = await axios.post(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/expenses`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  async update(travelPlanId, id, data) {
    const response = await axios.put(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/expenses/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  async delete(travelPlanId, id) {
    await axios.delete(
      `${BASE_URL}/api/travel-plans/${travelPlanId}/expenses/${id}`,
      getAuthHeaders()
    );
  }
};