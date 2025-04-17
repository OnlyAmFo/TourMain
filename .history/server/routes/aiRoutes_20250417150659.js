const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize Hugging Face client with error handling
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
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

// Helper function to format prompt for GPT-2
const formatPrompt = (prompt) => {
  return `As a travel assistant, I can help you with: ${prompt}`;
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
    
    const prompt = formatPrompt(`travel recommendations based on:
    Budget: ${preferences.budget}
    Duration: ${preferences.duration}
    Interests: ${preferences.interests.join(', ')}
    Travel Style: ${preferences.travelStyle}`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.9,
          top_p: 0.95,
          repetition_penalty: 1.2
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
    
    const prompt = formatPrompt(`a ${duration}-day trip plan for ${destination} with:
    Travel Style: ${preferences.travelStyle}
    Interests: ${preferences.interests.join(', ')}
    Budget: ${preferences.budget}`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 300,
          temperature: 0.9,
          top_p: 0.95,
          repetition_penalty: 1.2
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
    
    const prompt = formatPrompt(`answering your travel question: ${query}`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.9,
          top_p: 0.95,
          repetition_penalty: 1.2
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