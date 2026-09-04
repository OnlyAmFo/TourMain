const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Place = require('../models/Place');
const auth = require('../middleware/auth');

const fallbackPlaces = {
  place1: {
    _id: 'place1',
    title: 'Everest Base Camp',
    description: 'The classic trek to the foot of the world\'s highest mountain.',
    location: 'Khumbu, Nepal',
    images: ['/assets/places/5.jpg'],
    pricePerDay: 250,
    maxGroupSize: 12,
    featured: true,
  },
  place2: {
    _id: 'place2',
    title: 'Annapurna Circuit',
    description: 'A complete journey around the Annapurna massif.',
    location: 'Annapurna, Nepal',
    images: ['/assets/places/6.jpg'],
    pricePerDay: 200,
    maxGroupSize: 10,
    featured: true,
  },
  place3: {
    _id: 'place3',
    title: 'Langtang Valley',
    description: 'The valley of glaciers, pristine forests and mountain views.',
    location: 'Langtang, Nepal',
    images: ['/assets/places/7.jpg'],
    pricePerDay: 180,
    maxGroupSize: 8,
    featured: true,
  },
  place4: {
    _id: 'place4',
    title: 'Manaslu Circuit',
    description: 'Experience one of Nepal\'s most authentic treks.',
    location: 'Manaslu, Nepal',
    images: ['/assets/places/8.jpg'],
    pricePerDay: 220,
    maxGroupSize: 10,
    featured: true,
  },
  place5: {
    _id: 'place5',
    title: 'Upper Mustang',
    description: 'Journey into the hidden kingdom of Lo.',
    location: 'Mustang, Nepal',
    images: ['/assets/places/9.jpg'],
    pricePerDay: 300,
    maxGroupSize: 8,
    featured: true,
  },
  place6: {
    _id: 'place6',
    title: 'Gokyo Lakes',
    description: 'Visit the stunning turquoise lakes of Gokyo.',
    location: 'Khumbu, Nepal',
    images: ['/assets/places/10.jpg'],
    pricePerDay: 230,
    maxGroupSize: 10,
    featured: true,
  },
};

// Create a new booking
router.post('/', auth, async (req, res) => {
  console.log('Received booking request:', req.body);
  try {
    const { placeId, startDate, endDate, numberOfPeople } = req.body;

    // Validate required fields
    if (!placeId || !startDate || !endDate || !numberOfPeople) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let place = await Place.findById(placeId).exec();

    if (!place && fallbackPlaces[placeId]) {
      place = await Place.findOneAndUpdate(
        { _id: placeId },
        { $set: fallbackPlaces[placeId] },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

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
