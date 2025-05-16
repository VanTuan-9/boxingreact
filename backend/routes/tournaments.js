const express = require('express');
const {
  getAdminTournaments,
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament
} = require('../controllers/tournamentController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

router.get('/admin/list', protect, authorize('admin'), getAdminTournaments);
router.get('/', getTournaments);
router.get('/:id', getTournament);

// Thêm middleware upload cho routes POST và PUT
router.post('/', protect, authorize('admin'), (req, res, next) => {
  req.uploadType = 'tournament';
  next();
}, upload.single('image'), handleUploadError, createTournament);

router.put('/:id', protect, authorize('admin'), (req, res, next) => {
  req.uploadType = 'tournament';
  next();
}, upload.single('image'), handleUploadError, updateTournament);

router.delete('/:id', protect, authorize('admin'), deleteTournament);
router.post('/:id/register', protect, registerForTournament);

module.exports = router; 