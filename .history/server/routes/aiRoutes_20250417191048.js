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

// Predefined travel destinations and descriptions
const popularDestinations = {
  nepal: [
    {
      name: "Kathmandu",
      description: "The capital city with rich cultural heritage and ancient temples.",
      highlights: ["Durbar Square", "Swayambhunath Stupa", "Pashupatinath Temple"]
    },
    {
      name: "Pokhara",
      description: "A beautiful lakeside city with stunning mountain views.",
      highlights: ["Phewa Lake", "World Peace Pagoda", "Sarangkot"]
    },
    {
      name: "Chitwan",
      description: "Famous for its national park and wildlife experiences.",
      highlights: ["Chitwan National Park", "Jungle Safari", "Elephant Breeding Center"]
    }
  ],
  default: [
    {
      name: "Kathmandu",
      description: "The capital city with rich cultural heritage and ancient temples.",
      highlights: ["Durbar Square", "Swayambhunath Stupa", "Pashupatinath Temple"]
    },
    {
      name: "Pokhara",
      description: "A beautiful lakeside city with stunning mountain views.",
      highlights: ["Phewa Lake", "World Peace Pagoda", "Sarangkot"]
    },
    {
      name: "Chitwan",
      description: "Famous for its national park and wildlife experiences.",
      highlights: ["Chitwan National Park", "Jungle Safari", "Elephant Breeding Center"]
    }
  ]
};

// Helper function to format response
const formatResponse = (destinations) => {
  return destinations.map(dest => 
    `${dest.name}: ${dest.description}\nHighlights: ${dest.highlights.join(', ')}`
  ).join('\n\n');
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
    const location = preferences.location?.toLowerCase() || 'default';
    const destinations = popularDestinations[location] || popularDestinations.default;
    
    const baseResponse = formatResponse(destinations);
    const prompt = `Based on these destinations: ${baseResponse}\n\nCustomize this recommendation for someone with these preferences:\nBudget: ${preferences.budget}\nDuration: ${preferences.duration}\nInterests: ${preferences.interests.join(', ')}\nTravel Style: ${preferences.travelStyle}\n\nHere's a personalized recommendation:`;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
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

    // Combine the base response with the AI customization
    const finalResponse = `${baseResponse}\n\nPersonalized Recommendation:\n${response.data[0].generated_text}`;
    res.json({ recommendations: finalResponse });
  } catch (error) {
    console.error('Error getting AI recommendations:', error.response?.data || error.message);
    // Fallback to predefined response if AI fails
    const location = req.body.preferences?.location?.toLowerCase() || 'default';
    const destinations = popularDestinations[location] || popularDestinations.default;
    res.json({ recommendations: formatResponse(destinations) });
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
    const location = destination.toLowerCase();
    const basePlan = popularDestinations[location]?.[0] || popularDestinations.default[0];
    
    const prompt = `Create a ${duration}-day trip plan for ${destination} based on this information:\n${JSON.stringify(basePlan)}\n\nPreferences:\nTravel Style: ${preferences.travelStyle}\nInterests: ${preferences.interests.join(', ')}\nBudget: ${preferences.budget}\n\nHere's the plan:`;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 300,
          temperature: 0.7,
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
    const location = query.toLowerCase().includes('nepal') ? 'nepal' : 'default';
    const destinations = popularDestinations[location];
    
    const prompt = `Based on these destinations: ${JSON.stringify(destinations)}\n\nAnswer this question about travel: ${query}\n\nHere's the answer:`;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
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

// Helper function to format prompts for the model
const formatPrompt = (prompt) => {
  return `<s>[INST] ${prompt} [/INST]</s>`;
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    if (!huggingfaceApiKey) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }

    const { message } = req.body;
    const prompt = formatPrompt(`You are a helpful travel assistant. Please help with this question: ${message}`);

    const response = await axios.post(HUGGINGFACE_API_URL, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1
      }
    }, {
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data[0].generated_text });
  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Trek suggestions endpoint
router.post('/trek-suggestions', async (req, res) => {
  try {
    if (!huggingfaceApiKey) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }

    const { preferences } = req.body;
    const prompt = formatPrompt(`
      Based on the following preferences, suggest 3 trekking destinations:
      - Duration: ${preferences.duration} days
      - Difficulty: ${preferences.difficulty}
      - Budget: $${preferences.budget}
      - Interests: ${preferences.interests.join(', ')}
      
      For each suggestion, provide:
      1. Name of the trek
      2. Brief description
      3. Estimated cost
      4. Duration
      5. Difficulty level
      
      Format the response as a JSON array of objects with these properties.
    `);

    const response = await axios.post(HUGGINGFACE_API_URL, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1
      }
    }, {
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse the response and extract the JSON array
    const suggestionsText = response.data[0].generated_text;
    const suggestionsMatch = suggestionsText.match(/\[[\s\S]*\]/);
    const suggestions = suggestionsMatch ? JSON.parse(suggestionsMatch[0]) : [];

    res.json({ suggestions });
  } catch (error) {
    console.error('Trek suggestions error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate trek suggestions' });
  }
});

module.exports = router; 