const express = require('express');
const router = express.Router();
const {
  registerForClass,
  getRegistrations,
  acceptRegistration,
  rejectRegistration,
  deleteRegistration
} = require('../controllers/classRegistrationController');
const { protect, authorize } = require('../middleware/auth');

// User đăng ký lớp học
router.post('/', registerForClass);

// Admin xem danh sách đăng ký
router.get('/', protect, authorize('admin'), getRegistrations);

// Admin xác nhận/từ chối/xóa
router.put('/:id/accept', protect, authorize('admin'), acceptRegistration);
router.put('/:id/reject', protect, authorize('admin'), rejectRegistration);
router.delete('/:id', protect, authorize('admin'), deleteRegistration);

module.exports = router; 