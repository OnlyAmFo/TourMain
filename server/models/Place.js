const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  pricePerDay: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
