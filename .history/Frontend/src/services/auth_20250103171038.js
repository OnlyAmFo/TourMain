import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  async validateToken() {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear any other auth-related data from localStorage if needed
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
