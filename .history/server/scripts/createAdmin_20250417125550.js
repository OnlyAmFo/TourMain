const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const adminUser = new User({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      phone: '1234567890'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
