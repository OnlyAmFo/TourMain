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
  contact: "Yes, you can contact our officials through the following channels:\n\n📞 Phone: +977-1-4444444\n✉️ Email: info@tourapp.com\n\nOffice Hours:\nMonday to Friday: 9:00 AM - 5:00 PM (Nepal Time)\nSaturday: 9:00 AM - 1:00 PM\nSunday: Closed\n\nFor urgent matters, please call our 24/7 helpline: +977-1-5555555",
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

// Import tour packages
const tourPackages = require('./tourRoutes').tourPackages;

// Helper function to filter tours by budget
const filterToursByBudget = (tours, budget) => {
  const numericBudget = parseInt(budget.replace(/[^0-9]/g, ''));
  return tours.filter(tour => {
    const tourPrice = parseInt(tour.price.replace('$', ''));
    return tourPrice <= numericBudget;
  });
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    // Check for budget-specific tour queries
    if (lowerMessage.includes('tour') && lowerMessage.includes('nepal')) {
      const budgetMatch = message.match(/\$?\d+/);
      if (budgetMatch) {
        const budget = budgetMatch[0];
        const availableTours = tourPackages.nepal;
        const filteredTours = filterToursByBudget(availableTours, budget);

        if (filteredTours.length > 0) {
          const toursList = filteredTours.map(tour => 
            `\n• ${tour.name}\n  Duration: ${tour.duration}\n  Price: ${tour.price}\n  Description: ${tour.description}`
          ).join('\n');

          return res.json({
            response: `Here are the tours in Nepal within your budget of $${budget}:${toursList}\n\nWould you like to know more details about any of these tours?`
          });
        } else {
          return res.json({
            response: `I couldn't find any tours in Nepal within your budget of $${budget}. Our tours start from $800. Would you like to see our available tours?`
          });
        }
      }
    }

    // Handle other queries with AI
    if (!huggingfaceApiKey) {
      return res.json({ response: fallbackResponses.chat });
    }

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: message,
        parameters: {
          max_new_tokens: 150,
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
    console.error('Error in chat endpoint:', error);
    res.json({ response: fallbackResponses.chat });
  }
});

// Predefined trek suggestions
const trekSuggestions = {
  easy: [
    {
      name: "Ghorepani Poon Hill Trek",
      description: "A beautiful trek through rhododendron forests with stunning views of the Annapurna range.",
      duration: 4,
      difficulty: "easy",
      estimatedCost: 800,
      bestFor: ["Mountain Views", "Nature", "Photography"]
    },
    {
      name: "Langtang Valley Trek",
      description: "Experience the beautiful Langtang Valley with its diverse flora and fauna.",
      duration: 7,
      difficulty: "easy",
      estimatedCost: 1000,
      bestFor: ["Wildlife", "Nature", "Cultural Experience"]
    }
  ],
  moderate: [
    {
      name: "Annapurna Base Camp Trek",
      description: "Trek to the base camp of the majestic Annapurna massif.",
      duration: 10,
      difficulty: "moderate",
      estimatedCost: 1200,
      bestFor: ["Mountain Views", "Adventure", "Nature"]
    },
    {
      name: "Mardi Himal Trek",
      description: "A relatively new trek offering spectacular views of the Annapurna range.",
      duration: 8,
      difficulty: "moderate",
      estimatedCost: 1100,
      bestFor: ["Mountain Views", "Nature", "Photography"]
    }
  ],
  challenging: [
    {
      name: "Everest Base Camp Trek",
      description: "The classic trek to the base camp of the world's highest mountain.",
      duration: 14,
      difficulty: "challenging",
      estimatedCost: 1500,
      bestFor: ["Mountain Views", "Adventure", "Cultural Experience"]
    },
    {
      name: "Manaslu Circuit Trek",
      description: "A challenging trek around the eighth highest mountain in the world.",
      duration: 16,
      difficulty: "challenging",
      estimatedCost: 1800,
      bestFor: ["Adventure", "Mountain Views", "Cultural Experience"]
    }
  ]
};

// Trek Suggestions Route
router.post('/trek-suggestions', async (req, res) => {
  try {
    const { preferences } = req.body;
    const { duration, difficulty, interests, budget } = preferences;

    // Get base suggestions based on difficulty
    let suggestions = trekSuggestions[difficulty] || trekSuggestions.moderate;

    // Filter by duration if specified
    if (duration) {
      suggestions = suggestions.filter(trek => 
        Math.abs(trek.duration - parseInt(duration)) <= 2
      );
    }

    // Filter by budget if specified
    if (budget) {
      suggestions = suggestions.filter(trek => 
        trek.estimatedCost <= parseInt(budget)
      );
    }

    // Filter by interests if specified
    if (interests && interests.length > 0) {
      suggestions = suggestions.filter(trek =>
        interests.some(interest => trek.bestFor.includes(interest))
      );
    }

    // If no suggestions match the criteria, return some default suggestions
    if (suggestions.length === 0) {
      suggestions = trekSuggestions[difficulty] || trekSuggestions.moderate;
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting trek suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to get trek suggestions',
      details: error.message 
    });
  }
});

module.exports = router; 