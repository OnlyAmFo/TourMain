const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize DeepSeek client with error handling
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';
let deepseekApiKey;

try {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
  }
  deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  console.log('DeepSeek API Key initialized');
} catch (error) {
  console.error('Error initializing DeepSeek client:', error.message);
}

// AI Travel Recommendations
router.post('/recommendations', async (req, res) => {
  if (!deepseekApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { preferences } = req.body;
    
    const prompt = `Based on the following travel preferences, suggest 5 destinations:
    Budget: ${preferences.budget}
    Duration: ${preferences.duration}
    Interests: ${preferences.interests.join(', ')}
    Travel Style: ${preferences.travelStyle}
    
    Please provide a detailed response with:
    1. Destination name
    2. Brief description
    3. Best time to visit
    4. Estimated cost
    5. Key attractions`;

    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ recommendations: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to get AI recommendations',
      details: error.message 
    });
  }
});

// AI Trip Plan
router.post('/trip-plan', async (req, res) => {
  if (!deepseekApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { destination, duration, preferences } = req.body;
    
    const prompt = `Create a detailed ${duration}-day trip plan for ${destination} with the following preferences:
    Travel Style: ${preferences.travelStyle}
    Interests: ${preferences.interests.join(', ')}
    Budget: ${preferences.budget}
    
    Please provide a day-by-day itinerary with:
    1. Morning activities
    2. Afternoon activities
    3. Evening activities
    4. Recommended restaurants
    5. Transportation tips
    6. Budget estimates`;

    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ plan: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error getting AI trip plan:', error);
    res.status(500).json({ 
      error: 'Failed to get AI trip plan',
      details: error.message 
    });
  }
});

// AI Travel Assistant
router.post('/assistant', async (req, res) => {
  if (!deepseekApiKey) {
    return res.status(503).json({ 
      error: 'AI service is currently unavailable. Please check your API configuration.' 
    });
  }

  try {
    const { query } = req.body;
    
    const prompt = `You are a helpful travel assistant. Answer the following question about travel:
    ${query}
    
    Please provide a detailed, helpful response.`;

    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error getting AI assistant response:', error);
    res.status(500).json({ 
      error: 'Failed to get AI assistant response',
      details: error.message 
    });
  }
});

module.exports = router; 