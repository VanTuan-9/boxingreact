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

const router = express.Router();

router.get('/admin/list', protect, authorize('admin'), getAdminTournaments);
router.get('/', getTournaments);
router.get('/:id', getTournament);
router.post('/', protect, authorize('admin'), createTournament);
router.put('/:id', protect, authorize('admin'), updateTournament);
router.delete('/:id', protect, authorize('admin'), deleteTournament);
router.post('/:id/register', protect, registerForTournament);

module.exports = router; 