const TournamentRegistration = require('../models/TournamentRegistration');
const Notification = require('../models/Notification');

// User đăng ký giải đấu
exports.registerForTournament = async (req, res) => {
  try {
    // Chặn đăng ký trùng, cho phép đăng ký lại nếu bị từ chối
    if (req.body.user) {
      const existed = await TournamentRegistration.findOne({
        tournament: req.body.tournament,
        user: req.body.user,
        status: { $ne: 'rejected' }
      });
      if (existed) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã đăng ký giải này rồi. Vui lòng chờ duyệt hoặc liên hệ admin.'
        });
      }
    }
    const registration = await TournamentRegistration.create(req.body);

    // Tạo notification cho admin khi có user đăng ký giải đấu
    try {
      await Notification.create({
        title: 'Đăng ký giải đấu mới',
        message: `Học viên ${registration.name} vừa đăng ký giải đấu!`,
        type: 'info',
        recipients: 'admins',
        createdBy: registration.user || undefined
      });
    } catch (err) {}

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin lấy danh sách đăng ký
exports.getRegistrations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.tournament) filter.tournament = req.query.tournament;
    if (req.query.status) filter.status = req.query.status;
    
    // Phân trang
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Xử lý tìm kiếm nếu có
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Đếm tổng số bản ghi
    const total = await TournamentRegistration.countDocuments(filter);
    
    // Lấy dữ liệu theo phân trang
    const registrations = await TournamentRegistration.find(filter)
      .populate('tournament', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({ 
      success: true, 
      data: registrations,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin duyệt đăng ký
exports.acceptRegistration = async (req, res) => {
  try {
    const reg = await TournamentRegistration.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: reg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin từ chối đăng ký
exports.rejectRegistration = async (req, res) => {
  try {
    const reg = await TournamentRegistration.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: reg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin xóa đăng ký
exports.deleteRegistration = async (req, res) => {
  try {
    await TournamentRegistration.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Đã xóa đăng ký' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 