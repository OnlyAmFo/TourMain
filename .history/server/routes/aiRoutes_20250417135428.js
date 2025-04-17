const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// AI Travel Recommendations
router.post('/recommendations', async (req, res) => {
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

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({ recommendations: response.data.choices[0].text });
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    res.status(500).json({ error: 'Failed to get AI recommendations' });
  }
});

// AI Trip Plan
router.post('/trip-plan', async (req, res) => {
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

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    res.json({ plan: response.data.choices[0].text });
  } catch (error) {
    console.error('Error getting AI trip plan:', error);
    res.status(500).json({ error: 'Failed to get AI trip plan' });
  }
});

// AI Travel Assistant
router.post('/assistant', async (req, res) => {
  try {
    const { query } = req.body;
    
    const prompt = `You are a helpful travel assistant. Answer the following question about travel:
    ${query}
    
    Please provide a detailed, helpful response.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    console.error('Error getting AI assistant response:', error);
    res.status(500).json({ error: 'Failed to get AI assistant response' });
  }
});

module.exports = router; 