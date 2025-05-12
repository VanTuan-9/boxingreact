const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getDashboardData,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getTournaments
} = require('../controllers/adminController');

const {
  getAdminNotifications,
  createNotification,
  getNotification,
  updateNotification,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notificationController');

// Protect and authorize all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardData);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Tournament management routes (admin specific)
router.get('/tournaments', getTournaments);

// Notification routes
router.get('/notifications', getAdminNotifications);
router.post('/notifications', createNotification);
router.delete('/clear-notifications', deleteAllNotifications);
router.get('/notifications/:id', getNotification);
router.put('/notifications/:id', updateNotification);
router.delete('/notifications/:id', deleteNotification);

module.exports = router; 