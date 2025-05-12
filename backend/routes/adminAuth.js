const express = require('express');
const router = express.Router();
const { adminLogin, getMe, createAdmin, updateMe } = require('../controllers/adminAuthController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', adminLogin);
router.post('/create-admin', createAdmin);

// Protected routes
router.get('/me', protect, authorize('admin'), getMe);
router.put('/me', protect, authorize('admin'), updateMe);

module.exports = router; 