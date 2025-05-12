const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Admin login
// @route   POST /api/admin-auth/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    // Validate email/username & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email/username and password'
      });
    }

    // Check for user by email or username
    const user = await User.findOne({
      $or: [
        { email: email },
        { name: email } // Using email field for username too
      ]
    }).select('+password');
    
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is admin
    console.log('User role:', user.role);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('Login successful');
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin-auth/me
// @access  Private/Admin
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create admin account
// @route   POST /api/admin-auth/create-admin
// @access  Public
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists'
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update current logged in admin
// @route   PUT /api/admin-auth/me
// @access  Private/Admin
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // sẽ được hash bởi pre-save hook
    await user.save();
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 