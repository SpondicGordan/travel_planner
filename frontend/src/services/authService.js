// services/authService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_AUTH_API_URL;

export const authService = {
  async register(firstName, lastName, email, password) {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName,
      lastName,
      email,
      password
    });
    return response.data;
  },

  async login(email, password) {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};