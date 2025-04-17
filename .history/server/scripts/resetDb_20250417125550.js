const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function resetDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Drop the database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

    // Initialize with places data
    const Place = require('../models/Place');
    const places = [
      {
        _id: "place1",
        title: "Everest Base Camp Trek",
        location: "Khumbu, Nepal",
        description: "Experience the world's highest peak up close with our signature Everest Base Camp trek. Journey through Sherpa villages, ancient monasteries, and breathtaking Himalayan landscapes.",
        pricePerDay: 250,
        maxGroupSize: 12,
        featured: true,
        difficulty: "Challenging",
        duration: "14-16 days",
        altitude: "5,364m",
        bestSeason: "Mar-May, Sep-Nov",
        highlights: [
          "Everest Base Camp",
          "Kala Patthar viewpoint",
          "Namche Bazaar",
          "Tengboche Monastery"
        ],
        images: ["/assets/places/5.jpg"]
      },
      {
        _id: "place2",
        title: "Annapurna Circuit",
        location: "Annapurna, Nepal",
        description: "Trek around the entire Annapurna massif, crossing the challenging Thorong La Pass and experiencing dramatic changes in landscape, climate, and culture.",
        pricePerDay: 200,
        maxGroupSize: 10,
        featured: true,
        difficulty: "Moderate to Hard",
        duration: "12-14 days",
        altitude: "5,416m",
        bestSeason: "Oct-Nov, Mar-Apr",
        highlights: [
          "Thorong La Pass",
          "Muktinath Temple",
          "Tilicho Lake",
          "Hot Springs"
        ],
        images: ["/assets/places/6.jpg"]
      },
      {
        _id: "place3",
        title: "Langtang Valley Trek",
        location: "Langtang, Nepal",
        description: "Discover the serene Langtang Valley, known for its unique Tamang heritage, glaciers, and stunning mountain views. Perfect for those seeking a less crowded trekking experience.",
        pricePerDay: 180,
        maxGroupSize: 8,
        featured: true,
        difficulty: "Moderate",
        duration: "7-9 days",
        altitude: "4,984m",
        bestSeason: "Mar-May, Sep-Dec",
        highlights: [
          "Kyanjin Gompa",
          "Tserko Ri",
          "Langtang Village",
          "Local Cheese Factory"
        ],
        images: ["/assets/places/7.jpg"]
      },
      {
        _id: "place4",
        title: "Manaslu Circuit Trek",
        location: "Manaslu, Nepal",
        description: "Experience one of Nepal's most authentic treks around the world's eighth highest mountain. Enjoy pristine mountain views and rich cultural heritage.",
        pricePerDay: 220,
        maxGroupSize: 10,
        featured: true,
        difficulty: "Challenging",
        duration: "14-16 days",
        altitude: "5,160m",
        bestSeason: "Mar-May, Sep-Nov",
        highlights: [
          "Larkya La Pass",
          "Tibetan Monasteries",
          "Remote Villages",
          "Diverse Ecosystems"
        ],
        images: ["/assets/places/8.jpg"]
      },
      {
        _id: "place5",
        title: "Upper Mustang Trek",
        location: "Mustang, Nepal",
        description: "Journey into the hidden kingdom of Lo, featuring dramatic landscapes, ancient monasteries, and preserved Tibetan culture in this rain-shadow region.",
        pricePerDay: 300,
        maxGroupSize: 8,
        featured: true,
        difficulty: "Moderate",
        duration: "10-12 days",
        altitude: "3,840m",
        bestSeason: "Jun-Aug",
        highlights: [
          "Lo Manthang",
          "Sky Caves",
          "Ancient Monasteries",
          "Desert Landscapes"
        ],
        images: ["/assets/places/9.jpg"]
      },
      {
        _id: "place6",
        title: "Gokyo Lakes Trek",
        location: "Khumbu, Nepal",
        description: "Visit the stunning turquoise lakes of Gokyo and climb Gokyo Ri for panoramic views of Everest, Lhotse, Makalu, and Cho Oyu.",
        pricePerDay: 230,
        maxGroupSize: 10,
        featured: true,
        difficulty: "Moderate to Hard",
        duration: "12-14 days",
        altitude: "5,357m",
        bestSeason: "Mar-May, Sep-Nov",
        highlights: [
          "Gokyo Lakes",
          "Gokyo Ri",
          "Ngozumpa Glacier",
          "Cho La Pass"
        ],
        images: ["/assets/places/10.jpg"]
      }
    ];

    await Place.insertMany(places);
    console.log('Places data initialized');

    // Create admin user if it doesn't exist
    const User = require('../models/User');
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    };

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('Admin user created');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetDatabase(); 