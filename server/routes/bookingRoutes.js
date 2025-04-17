const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Place = require('../models/Place');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
  console.log('Received booking request:', req.body);
  try {
    const { placeId, startDate, endDate, numberOfPeople } = req.body;

    // Validate required fields
    if (!placeId || !startDate || !endDate || !numberOfPeople) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the place
    const place = await Place.findById(placeId).exec();
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Validate group size
    if (numberOfPeople > place.maxGroupSize) {
      return res.status(400).json({ 
        message: `Maximum group size is ${place.maxGroupSize} people` 
      });
    }

    // Calculate total price
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }
    
    const totalPrice = days * place.pricePerDay * numberOfPeople;

    const booking = new Booking({
      user: req.user.userId,
      place: placeId,
      startDate: startDateTime,
      endDate: endDateTime,
      numberOfPeople,
      totalPrice,
      status: 'pending'
    });

    await booking.save();
    
    // Populate both place and user details
    await booking.populate([
      { 
        path: 'place', 
        select: 'title location images pricePerDay maxGroupSize' 
      },
      { 
        path: 'user', 
        select: 'name email' 
      }
    ]);
    
    console.log('Booking created:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      message: 'Failed to create booking', 
      error: error.message 
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('place')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('place', 'title')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
