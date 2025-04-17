const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize Hugging Face client with error handling
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/distilgpt2';
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

// Helper function to format prompt for DistilGPT-2
const formatPrompt = (prompt) => {
  return `Here are some travel suggestions: ${prompt}`;
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
    
    const prompt = formatPrompt(`For a trip with budget ${preferences.budget}, duration ${preferences.duration}, interests in ${preferences.interests.join(', ')}, and ${preferences.travelStyle} travel style, I recommend`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 1.0,
          top_p: 0.95,
          repetition_penalty: 1.5
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
    
    const prompt = formatPrompt(`For a ${duration}-day trip to ${destination} with ${preferences.travelStyle} style, interests in ${preferences.interests.join(', ')}, and budget ${preferences.budget}, here's a plan:`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 1.0,
          top_p: 0.95,
          repetition_penalty: 1.5
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
    
    const prompt = formatPrompt(`Regarding your question about ${query}, here's what I suggest:`);

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 1.0,
          top_p: 0.95,
          repetition_penalty: 1.5
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