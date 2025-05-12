const express = require('express');
const {
  getAdminClasses,
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addMember,
  removeMember,
  adminCreateClass,
  testCreateClass,
  seedClasses
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public test routes (remove in production)
router.post('/test/create', testCreateClass);
router.get('/seed', seedClasses);

// Admin routes
router.get('/admin/list', protect, authorize('admin'), getAdminClasses);
router.post('/admin/create', protect, authorize('admin'), adminCreateClass);

// Public routes
router.get('/', getClasses);
router.get('/:id', getClass);

// Protected routes
router.post('/', protect, authorize('admin'), (req, res, next) => { req.uploadType = 'class'; next(); }, upload.single('image'), handleUploadError, createClass);
router.put('/:id', protect, authorize('admin'), (req, res, next) => { req.uploadType = 'class'; next(); }, upload.single('image'), handleUploadError, updateClass);
router.delete('/:id', protect, authorize('admin'), deleteClass);
router.post('/:id/members/:userId', protect, authorize('admin'), addMember);
router.delete('/:id/members/:userId', protect, authorize('admin'), removeMember);

module.exports = router; 