const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const auth = require('../middleware/auth');

// Get all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.find()
      .populate('reviews.user', 'name')
      .sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured places
router.get('/featured', async (req, res) => {
  try {
    const places = await Place.find({ featured: true })
      .populate('reviews.user', 'name')
      .sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('reviews.user', 'name');
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add review to place
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user has already reviewed
    const hasReviewed = place.reviews.some(
      review => review.user.toString() === req.user.userId
    );

    if (hasReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this place' });
    }

    place.reviews.push({
      user: req.user.userId,
      rating,
      comment,
    });

    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Create new place
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update place
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const place = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete place
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const place = await Place.findByIdAndDelete(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
