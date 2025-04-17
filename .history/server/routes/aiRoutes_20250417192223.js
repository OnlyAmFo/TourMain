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

// Predefined travel responses for common queries
const predefinedResponses = {
  greeting: "Hello! I'm your travel assistant. I can help you plan trips, suggest destinations, and provide travel tips. What would you like to know about?",
  tours: "I'd be happy to suggest some tours! To help me provide the best recommendations, could you tell me:\n\n1. Your preferred destination or region\n2. Your travel dates\n3. Your interests (culture, adventure, relaxation, etc.)\n4. Your budget range\n5. Any specific requirements (accessibility, family-friendly, etc.)",
  default: "I'm here to help with your travel questions! I can assist with:\n\n• Destination recommendations\n• Travel planning and itineraries\n• Booking guidance\n• Travel tips and advice\n• Local customs and culture\n\nWhat specific travel information are you looking for?"
};

// Fallback responses for when the AI service is unavailable
const fallbackResponses = {
  chat: predefinedResponses.default,
  trekSuggestions: [
    {
      name: "Everest Base Camp Trek",
      description: "A classic trek through the Khumbu region, offering stunning views of Mount Everest and surrounding peaks.",
      estimatedCost: 1500,
      duration: "14 days",
      difficulty: "Challenging"
    },
    {
      name: "Annapurna Circuit",
      description: "One of the world's most famous treks, circling the Annapurna massif through diverse landscapes.",
      estimatedCost: 1200,
      duration: "18 days",
      difficulty: "Moderate to Challenging"
    },
    {
      name: "Langtang Valley Trek",
      description: "A beautiful trek through the Langtang Valley, offering a mix of culture and nature.",
      estimatedCost: 900,
      duration: "10 days",
      difficulty: "Moderate"
    }
  ]
};

// Helper function to detect common queries
const detectCommonQuery = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/)) {
    return 'greeting';
  }
  
  // Check for tour requests
  if (lowerMessage.match(/(tour|trip|travel|destination|place|visit|go|see|explore)/)) {
    return 'tours';
  }
  
  return null;
};

// Helper function to clean and format the AI response
const cleanAiResponse = (text) => {
  // Remove any HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Remove any markdown formatting
  text = text.replace(/\[.*?\]/g, '');
  text = text.replace(/\(.*?\)/g, '');
  
  // Remove any URLs
  text = text.replace(/https?:\/\/[^\s]+/g, '');
  
  // Remove any email addresses
  text = text.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '');
  
  // Remove any numbers followed by dots (like "1. ", "2. ", etc.)
  text = text.replace(/\d+\.\s/g, '');
  
  // Remove any random numbers or technical content
  text = text.replace(/\b\d{3,}\b/g, '');
  
  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check for common queries first
    const commonQueryType = detectCommonQuery(message);
    if (commonQueryType && predefinedResponses[commonQueryType]) {
      return res.json({ response: predefinedResponses[commonQueryType] });
    }
    
    // If not a common query, use the AI model
    if (!huggingfaceApiKey) {
      return res.json({ response: fallbackResponses.chat });
    }

    const prompt = `You are a helpful travel assistant. Your role is to provide clear, concise travel advice and answer questions about destinations, planning, and travel tips. Keep responses focused on travel-related topics and use a friendly, professional tone.

User: ${message}

Assistant:`;

    try {
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

      // Clean and format the response
      let formattedResponse = cleanAiResponse(response.data[0].generated_text);
      
      // If the response is too short or contains problematic content, use fallback
      if (formattedResponse.length < 10 || 
          formattedResponse.includes('Synchronize') || 
          formattedResponse.includes('goroutine') ||
          formattedResponse.includes('socket') ||
          formattedResponse.includes('TCP') ||
          formattedResponse.includes('job') ||
          formattedResponse.includes('advisor') ||
          formattedResponse.includes('work assignment') ||
          formattedResponse.includes('room') ||
          formattedResponse.includes('place before the trip')) {
        formattedResponse = fallbackResponses.chat;
      }

      res.json({ response: formattedResponse });
    } catch (error) {
      console.error('AI API Error:', error.response?.data || error.message);
      res.json({ response: fallbackResponses.chat });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.json({ response: fallbackResponses.chat });
  }
});

// Trek suggestions endpoint
router.post('/trek-suggestions', async (req, res) => {
  try {
    if (!huggingfaceApiKey) {
      return res.json({ suggestions: fallbackResponses.trekSuggestions });
    }

    const { preferences } = req.body;
    const prompt = `You are a trekking expert. Your role is to suggest appropriate treks based on user preferences.

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

Format the response as a JSON array of objects with these properties.`;

    try {
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
      const suggestions = suggestionsMatch ? JSON.parse(suggestionsMatch[0]) : fallbackResponses.trekSuggestions;

      res.json({ suggestions });
    } catch (error) {
      console.error('AI API Error:', error.response?.data || error.message);
      res.json({ suggestions: fallbackResponses.trekSuggestions });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.json({ suggestions: fallbackResponses.trekSuggestions });
  }
});

module.exports = router; 