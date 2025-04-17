const express = require('express');
const router = express.Router();

// Predefined tour packages
const tourPackages = {
  nepal: [
    {
      id: 1,
      name: "Classic Nepal Tour",
      duration: "7 days",
      price: "$800",
      description: "Explore the best of Nepal's cultural and natural wonders",
      itinerary: [
        "Day 1: Arrival in Kathmandu, city tour",
        "Day 2: Visit Swayambhunath and Pashupatinath",
        "Day 3: Drive to Pokhara, explore lakeside",
        "Day 4: Sunrise at Sarangkot, boating in Phewa Lake",
        "Day 5: Visit World Peace Pagoda, free time",
        "Day 6: Return to Kathmandu, shopping",
        "Day 7: Departure"
      ],
      includes: [
        "Accommodation in 3-star hotels",
        "Daily breakfast",
        "All transportation",
        "Entrance fees",
        "English speaking guide"
      ],
      bestFor: ["First-time visitors", "Cultural enthusiasts", "Photography lovers"]
    },
    {
      id: 2,
      name: "Adventure Nepal",
      duration: "10 days",
      price: "$1200",
      description: "Thrilling adventure activities in Nepal's most beautiful locations",
      itinerary: [
        "Day 1: Arrival in Kathmandu",
        "Day 2: White water rafting in Trishuli River",
        "Day 3: Drive to Pokhara",
        "Day 4: Paragliding in Pokhara",
        "Day 5: Trek to Australian Camp",
        "Day 6: Return to Pokhara",
        "Day 7: Drive to Chitwan",
        "Day 8: Jungle Safari",
        "Day 9: Return to Kathmandu",
        "Day 10: Departure"
      ],
      includes: [
        "Accommodation in 3-star hotels",
        "Daily breakfast",
        "All adventure activities",
        "Transportation",
        "Professional guides"
      ],
      bestFor: ["Adventure seekers", "Nature lovers", "Active travelers"]
    },
    {
      id: 3,
      name: "Spiritual Nepal",
      duration: "8 days",
      price: "$950",
      description: "A journey through Nepal's spiritual and religious sites",
      itinerary: [
        "Day 1: Arrival in Kathmandu",
        "Day 2: Visit Boudhanath and Swayambhunath",
        "Day 3: Meditation at Kopan Monastery",
        "Day 4: Drive to Lumbini",
        "Day 5: Explore Lumbini, birthplace of Buddha",
        "Day 6: Return to Kathmandu",
        "Day 7: Visit Pashupatinath and Dakshinkali",
        "Day 8: Departure"
      ],
      includes: [
        "Accommodation in 3-star hotels",
        "Daily breakfast",
        "All transportation",
        "Entrance fees",
        "Meditation sessions"
      ],
      bestFor: ["Spiritual seekers", "Yoga enthusiasts", "Peace lovers"]
    }
  ]
};

// Helper function to filter tours based on preferences
const filterTours = (tours, preferences) => {
  return tours.filter(tour => {
    // Check duration
    const tourDuration = parseInt(tour.duration);
    const prefDuration = parseInt(preferences.duration);
    if (prefDuration && tourDuration > prefDuration) return false;

    // Check budget
    const tourPrice = parseInt(tour.price.replace('$', ''));
    const prefBudget = parseInt(preferences.budget);
    if (prefBudget && tourPrice > prefBudget) return false;

    // Check interests
    if (preferences.interests && preferences.interests.length > 0) {
      const hasMatchingInterest = preferences.interests.some(interest => 
        tour.bestFor.some(category => 
          category.toLowerCase().includes(interest.toLowerCase())
        )
      );
      if (!hasMatchingInterest) return false;
    }

    return true;
  });
};

// Get all tours
router.get('/', (req, res) => {
  try {
    res.json(tourPackages.nepal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Get tours by preferences
router.post('/recommendations', (req, res) => {
  try {
    const { preferences } = req.body;
    const filteredTours = filterTours(tourPackages.nepal, preferences);
    
    if (filteredTours.length === 0) {
      res.json({
        message: "No exact matches found. Here are our most popular tours:",
        tours: tourPackages.nepal.slice(0, 2)
      });
    } else {
      res.json({
        message: "Here are tours matching your preferences:",
        tours: filteredTours
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tour recommendations' });
  }
});

// Get tour by ID
router.get('/:id', (req, res) => {
  try {
    const tour = tourPackages.nepal.find(t => t.id === parseInt(req.params.id));
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour details' });
  }
});

module.exports = router; 