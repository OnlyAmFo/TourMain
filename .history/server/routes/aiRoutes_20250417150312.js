const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize Hugging Face client with error handling
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
let huggingfaceApiKey;

try {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
  }
  huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
  console.log('Hugging Face API Key initialized');
} catch (error) {
  console.error('Error initializing Hugging Face client:', error.message);
}

// Helper function to format prompt for Blenderbot
const formatPrompt = (prompt) => {
  return `You are a helpful travel assistant. ${prompt}`;
};

// AI Travel Recommendations
router.post('/recommendations', async (req, res) => {
  if (!huggingfaceApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { preferences } = req.body;
    
    const prompt = formatPrompt(`Based on the following travel preferences, suggest 5 destinations:
    Budget: ${preferences.budget}
    Duration: ${preferences.duration}
    Interests: ${preferences.interests.join(', ')}
    Travel Style: ${preferences.travelStyle}
    
    Please provide a detailed response with:
    1. Destination name
    2. Brief description
    3. Best time to visit
    4. Estimated cost
    5. Key attractions`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ recommendations: response.data[0].generated_text });
  } catch (error) {
    console.error('Error getting AI recommendations:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get AI recommendations',
      details: error.response?.data?.error || error.message 
    });
  }
});

// AI Trip Plan
router.post('/trip-plan', async (req, res) => {
  if (!huggingfaceApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { destination, duration, preferences } = req.body;
    
    const prompt = formatPrompt(`Create a detailed ${duration}-day trip plan for ${destination} with the following preferences:
    Travel Style: ${preferences.travelStyle}
    Interests: ${preferences.interests.join(', ')}
    Budget: ${preferences.budget}
    
    Please provide a day-by-day itinerary with:
    1. Morning activities
    2. Afternoon activities
    3. Evening activities
    4. Recommended restaurants
    5. Transportation tips
    6. Budget estimates`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ plan: response.data[0].generated_text });
  } catch (error) {
    console.error('Error getting AI trip plan:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get AI trip plan',
      details: error.response?.data?.error || error.message 
    });
  }
});

// AI Travel Assistant
router.post('/assistant', async (req, res) => {
  if (!huggingfaceApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { query } = req.body;
    
    const prompt = formatPrompt(`Answer the following question about travel:
    ${query}
    
    Please provide a detailed, helpful response.`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ response: response.data[0].generated_text });
  } catch (error) {
    console.error('Error getting AI assistant response:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get AI assistant response',
      details: error.response?.data?.error || error.message 
    });
  }
});

module.exports = router; 