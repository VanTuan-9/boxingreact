const express = require('express');
const router = express.Router();
const {
  registerForTournament,
  getRegistrations,
  acceptRegistration,
  rejectRegistration,
  deleteRegistration
} = require('../controllers/tournamentRegistrationController');
const { protect, authorize } = require('../middleware/auth');

// User đăng ký giải đấu
router.post('/', registerForTournament);

// Admin xem danh sách đăng ký
router.get('/', protect, authorize('admin'), getRegistrations);

// Admin duyệt/từ chối/xóa
router.put('/:id/accept', protect, authorize('admin'), acceptRegistration);
router.put('/:id/reject', protect, authorize('admin'), rejectRegistration);
router.delete('/:id', protect, authorize('admin'), deleteRegistration);

module.exports = router; 