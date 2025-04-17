const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      location,
      interests,
      privacySettings
    } = req.body;

    // Find user and update profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.interests = interests || user.interests;
    user.privacySettings = {
      ...user.privacySettings,
      ...privacySettings
    };

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public profile (for other users to view)
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name bio location interests privacySettings');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check privacy settings
    if (!user.privacySettings.showInSearch) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    // Filter out private information based on privacy settings
    const publicProfile = {
      name: user.name,
      bio: user.bio,
      location: user.location,
      interests: user.interests,
      contactInfo: user.privacySettings.showContactInfo ? {
        email: user.email,
        phone: user.phone
      } : null
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 