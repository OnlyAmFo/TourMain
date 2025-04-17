import api from './api';

export const adminService = {
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async toggleUserBlock(userId) {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  },

  async getBookings() {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  async updateBookingStatus(bookingId, status) {
    const response = await api.patch(`/admin/bookings/${bookingId}`, { status });
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  async getPlaces() {
    const response = await api.get('/admin/places');
    return response.data;
  },

  async createPlace(placeData) {
    const response = await api.post('/admin/places', placeData);
    return response.data;
  },

  async updatePlace(placeId, placeData) {
    const response = await api.put(`/admin/places/${placeId}`, placeData);
    return response.data;
  },

  async deletePlace(placeId) {
    const response = await api.delete(`/admin/places/${placeId}`);
    return response.data;
  },
}; 