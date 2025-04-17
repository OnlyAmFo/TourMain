import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAITravelRecommendations = async (preferences) => {
  try {
    const response = await axios.post(`${API_URL}/ai/recommendations`, preferences);
    return response.data;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

export const getAITripPlan = async (destination, duration, preferences) => {
  try {
    const response = await axios.post(`${API_URL}/ai/trip-plan`, {
      destination,
      duration,
      preferences
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI trip plan:', error);
    throw error;
  }
};

export const getAITravelAssistant = async (query) => {
  try {
    const response = await axios.post(`${API_URL}/ai/assistant`, { query });
    return response.data;
  } catch (error) {
    console.error('Error getting AI travel assistant:', error);
    throw error;
  }
}; 