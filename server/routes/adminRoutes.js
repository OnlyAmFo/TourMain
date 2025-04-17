const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const Place = require('../models/Place');
const upload = require('../middleware/upload');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/Unblock user
router.patch('/users/:id/block', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', auth, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('place', 'title')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.patch('/bookings/:id', auth, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to your existing adminRoutes.js
router.get('/statistics', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('place', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all places
router.get('/places', auth, isAdmin, async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create place
router.post('/places', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const place = new Place({
      ...req.body,
      image: req.file ? req.file.path : null,
      createdBy: req.user.userId
    });
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete place
router.delete('/places/:id', auth, isAdmin, async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 