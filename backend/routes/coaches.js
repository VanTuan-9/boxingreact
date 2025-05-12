const express = require('express');
const {
  getCoaches,
  getCoach,
  createCoach,
  updateCoach,
  deleteCoach,
  seedCoaches
} = require('../controllers/coachController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/seed', seedCoaches);
router.get('/', getCoaches);
router.get('/:id', getCoach);

// Protected routes - Admin only
router.post('/', protect, authorize('admin'), upload.single('profileImage'), handleUploadError, createCoach);
router.put('/:id', protect, authorize('admin'), upload.single('profileImage'), handleUploadError, updateCoach);
router.delete('/:id', protect, authorize('admin'), deleteCoach);

module.exports = router; 