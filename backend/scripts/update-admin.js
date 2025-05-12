const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/boxingapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

async function updateOrCreateAdmin() {
  try {
    // Try to find existing user duchung
    let user = await User.findOne({ name: 'duchung' });
    
    if (user) {
      // Update existing user to admin
      user.role = 'admin';
      await user.save();
      console.log('User duchung updated to admin role');
    } else {
      // Create new admin user if duchung doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('daikaanh', salt);
      
      user = await User.create({
        name: 'duchung',
        email: 'duchung@example.com', // You can change this email
        password: hashedPassword,
        role: 'admin'
      });
      console.log('New admin user duchung created');
    }

    // Also ensure the test admin exists
    const testAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!testAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Test admin account created');
    }

    console.log('Admin setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
connectDB().then(() => {
  updateOrCreateAdmin();
}); 