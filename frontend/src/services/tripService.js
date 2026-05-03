// services/tripService.js
import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.REACT_APP_TRAVEL_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const tripService = {
  async getAll() {
    const response = await axios.get(`${BASE_URL}/api/travel-plans`, getAuthHeaders());
    return response.data;
  },

  async getById(id) {
    const response = await axios.get(`${BASE_URL}/api/travel-plans/${id}`, getAuthHeaders());
    return response.data;
  },

  async create(data) {
    const response = await axios.post(`${BASE_URL}/api/travel-plans`, data, getAuthHeaders());
    return response.data;
  },

  async update(id, data) {
    const response = await axios.put(`${BASE_URL}/api/travel-plans/${id}`, data, getAuthHeaders());
    return response.data;
  },

  async delete(id) {
    await axios.delete(`${BASE_URL}/api/travel-plans/${id}`, getAuthHeaders());
  }
};