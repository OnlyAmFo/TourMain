const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "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";
const SITE_URL = "http://localhost:3000"; // Update this with your actual site URL
const SITE_NAME = "TourApp"; // Update this with your site name

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
  if (!OPENROUTER_API_KEY) {
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
      OPENROUTER_API_URL,
      {
        model: "deepseek/deepseek-prover-v2:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json"
        }
      }
    );

    // Combine the base response with the AI customization
    const finalResponse = `${baseResponse}\n\nPersonalized Recommendation:\n${response.data.choices[0].message.content}`;
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
  try {
    const { destination, duration, preferences } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key is not configured' });
    }

    // Call OpenRouter AI API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner specializing in creating detailed day-by-day itineraries for Nepal. Always provide specific locations and activities that exist in Nepal.'
          },
          {
            role: 'user',
            content: `Create a detailed ${duration}-day itinerary for ${destination}, Nepal with the following preferences:
            Travel Style: ${preferences.travelStyle}
            Interests: ${preferences.interests.join(', ')}
            Budget: ${preferences.budget}
            Group Size: ${preferences.groupSize}
            Season: ${preferences.season}

            Please provide the itinerary in the following format:
            Day 1:
            - Morning: [Activity with time and location]
            - Afternoon: [Activity with time and location]
            - Evening: [Activity with time and location]
            - Accommodation: [Hotel/Stay details]
            - Meals: [Breakfast/Lunch/Dinner details]

            [Repeat for each day]
            
            Make sure all locations and activities are specific to Nepal and actually exist.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TourApp',
          'Content-Type': 'application/json'
        }
      }
    );

    // Get the AI response
    const plan = response.data.choices[0].message.content;
    res.json({ plan });
  } catch (error) {
    console.error('Error generating trip plan:', error);
    res.status(500).json({ 
      error: 'Failed to generate trip plan',
      details: error.response?.data?.error || error.message 
    });
  }
});

// AI Travel Assistant
router.post('/assistant', async (req, res) => {
  if (!OPENROUTER_API_KEY) {
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
      OPENROUTER_API_URL,
      {
        model: "deepseek/deepseek-prover-v2:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ response: response.data.choices[0].message.content });
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
    if (!OPENROUTER_API_KEY) {
      return res.json({ response: fallbackResponses.chat });
    }

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "deepseek/deepseek-prover-v2:free",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json"
          }
        }
      );

      // Clean and format the response
      let botResponse = response.data.choices[0].message.content;
      botResponse = cleanAiResponse(botResponse);

      // If response is too short or empty, use fallback
      if (!botResponse || botResponse.length < 10) {
        botResponse = fallbackResponses.chat;
      }

      res.json({ response: botResponse });
    } catch (apiError) {
      console.error('OpenRouter API Error:', apiError.message);
      // Use fallback response for API errors
      res.json({ response: fallbackResponses.chat });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.json({ response: fallbackResponses.chat });
  }
});

// Predefined trek suggestions
const trekSuggestions = {
  easy: [
    {
      id: "ghorepani",
      name: "Ghorepani Poon Hill Trek",
      description: "A beautiful trek through rhododendron forests with stunning views of the Annapurna range.",
      duration: 5,
      difficulty: "easy",
      estimatedCost: 800,
      bestInterests: ["photography", "nature", "culture"]
    },
    {
      id: "langtang",
      name: "Langtang Valley Trek",
      description: "Experience the rich culture of the Tamang people and beautiful mountain views.",
      duration: 7,
      difficulty: "easy",
      estimatedCost: 1000,
      bestInterests: ["culture", "nature", "photography"]
    }
  ],
  moderate: [
    {
      id: "abc",
      name: "Annapurna Base Camp Trek",
      description: "Trek to the base of the majestic Annapurna massif through diverse landscapes.",
      duration: 12,
      difficulty: "moderate",
      estimatedCost: 1500,
      bestInterests: ["adventure", "nature", "photography"]
    },
    {
      id: "mardi",
      name: "Mardi Himal Trek",
      description: "A hidden gem offering spectacular views of the Annapurna range.",
      duration: 8,
      difficulty: "moderate",
      estimatedCost: 1200,
      bestInterests: ["adventure", "nature", "photography"]
    }
  ],
  challenging: [
    {
      id: "ebc",
      name: "Everest Base Camp Trek",
      description: "The classic trek to the base of the world's highest mountain.",
      duration: 14,
      difficulty: "challenging",
      estimatedCost: 2000,
      bestInterests: ["adventure", "photography", "achievement"]
    },
    {
      id: "manaslu",
      name: "Manaslu Circuit Trek",
      description: "A challenging trek around the world's eighth highest mountain.",
      duration: 16,
      difficulty: "challenging",
      estimatedCost: 2500,
      bestInterests: ["adventure", "culture", "photography"]
    }
  ]
};

// Trek Suggestions Route
router.post('/trek-suggestions', async (req, res) => {
  try {
    const { duration, difficulty, interests, budget } = req.body;

    // Filter treks based on preferences
    let suggestions = [];
    const allTreks = [
      ...trekSuggestions.easy,
      ...trekSuggestions.moderate,
      ...trekSuggestions.challenging
    ];

    // Filter by duration (allow ±2 days range)
    if (duration) {
      suggestions = allTreks.filter(
        trek => Math.abs(trek.duration - duration) <= 2
      );
    }

    // Filter by difficulty
    if (difficulty) {
      suggestions = suggestions.length > 0
        ? suggestions.filter(trek => trek.difficulty === difficulty)
        : allTreks.filter(trek => trek.difficulty === difficulty);
    }

    // Filter by budget
    if (budget) {
      suggestions = suggestions.length > 0
        ? suggestions.filter(trek => trek.estimatedCost <= budget)
        : allTreks.filter(trek => trek.estimatedCost <= budget);
    }

    // Filter by interests
    if (interests && interests.length > 0) {
      suggestions = suggestions.length > 0
        ? suggestions.filter(trek => 
            interests.some(interest => trek.bestInterests.includes(interest))
          )
        : allTreks.filter(trek => 
            interests.some(interest => trek.bestInterests.includes(interest))
          );
    }

    // If no suggestions found, return all treks
    if (suggestions.length === 0) {
      suggestions = allTreks;
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

// Packing List Generator
router.post('/packing-list', async (req, res) => {
  try {
    const { destination, startDate, endDate, activities, specialNeeds } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key is not configured' });
    }

    // Call OpenRouter AI API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel assistant that generates detailed packing lists based on trip details.'
          },
          {
            role: 'user',
            content: `Generate a detailed packing list for a trip to ${destination} from ${startDate} to ${endDate}. 
            Planned activities: ${activities.join(', ')}. 
            Special needs: ${specialNeeds || 'None'}. 
            Include weather considerations, essential items, clothing, toiletries, electronics, first aid, and any additional tips.
            Format the response as a JSON object with the following structure:
            {
              "weatherSummary": "Brief weather summary",
              "essentials": ["item1", "item2", ...],
              "clothing": ["item1", "item2", ...],
              "toiletries": ["item1", "item2", ...],
              "electronics": ["item1", "item2", ...],
              "firstAid": ["item1", "item2", ...],
              "tips": ["tip1", "tip2", ...]
            }`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TourApp',
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the AI response
    const aiResponse = response.data.choices[0].message.content;
    const packingList = JSON.parse(aiResponse);

    res.json(packingList);
  } catch (error) {
    console.error('Error generating packing list:', error);
    res.status(500).json({ 
      error: 'Failed to generate packing list',
      details: error.response?.data?.error || error.message 
    });
  }
});

// Emotion-based Trip Recommender
router.post('/emotion-trips', async (req, res) => {
  try {
    const { mood } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key is not configured' });
    }

    // Call OpenRouter AI API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel assistant specializing in Nepalese destinations and experiences. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: `Recommend 3 trips in Nepal for someone feeling ${mood}. 
            Focus only on Nepalese destinations and experiences. Include a mix of:
            - Cultural experiences (temples, festivals, local life)
            - Adventure activities (trekking, rafting, wildlife)
            - Natural attractions (mountains, lakes, national parks)
            - Spiritual retreats (meditation, yoga, monasteries)
            
            Format your response as a JSON array of exactly 3 trip objects, each with these exact fields:
            {
              "title": "Trip title",
              "description": "Brief description",
              "location": "Specific location in Nepal",
              "bestTime": "Best time to visit",
              "moodMatch": 85,
              "whyThisTrip": "Why this trip matches their mood",
              "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"]
            }
            
            Make sure the response is valid JSON with no markdown formatting or additional text.
            All locations must be in Nepal.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TourApp',
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the AI response
    const aiResponse = response.data.choices[0].message.content;
    
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const recommendations = JSON.parse(cleanedResponse);
      
      // Validate that all locations are in Nepal
      const validRecommendations = recommendations.filter(rec => 
        rec.location.toLowerCase().includes('nepal') || 
        ['kathmandu', 'pokhara', 'chitwan', 'lumbini', 'bhaktapur', 'patan', 'nagarkot', 
         'bandipur', 'mustang', 'annapurna', 'everest', 'langtang', 'manaslu'].some(
           location => rec.location.toLowerCase().includes(location)
         )
      );

      if (validRecommendations.length === 0) {
        throw new Error('No valid Nepalese destinations found in recommendations');
      }

      res.json({ recommendations: validRecommendations });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', aiResponse);
      res.status(500).json({ 
        error: 'Failed to parse trip recommendations',
        details: 'Invalid JSON response from AI'
      });
    }
  } catch (error) {
    console.error('Error generating trip recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate trip recommendations',
      details: error.response?.data?.error || error.message 
    });
  }
});

module.exports = router; 