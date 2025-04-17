import api from './api';

export const bookingsService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  async cancelBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
};
