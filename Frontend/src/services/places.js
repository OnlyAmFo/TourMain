import api from './api';

export const placesService = {
  async getAllPlaces() {
    const response = await api.get('/places');
    return response.data;
  },

  async getFeaturedPlaces() {
    const response = await api.get('/places/featured');
    return response.data;
  },

  async getPlaceById(id) {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },

  async addReview(placeId, reviewData) {
    const response = await api.post(`/places/${placeId}/reviews`, reviewData);
    return response.data;
  },
};
