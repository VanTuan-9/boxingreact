const ClassRegistration = require('../models/ClassRegistration');
const Class = require('../models/Class');
const Notification = require('../models/Notification');

// User đăng ký lớp học
exports.registerForClass = async (req, res) => {
  try {
    // Kiểm tra nếu đã có đăng ký chưa bị từ chối
    if (req.body.user) {
      const existed = await ClassRegistration.findOne({
        class: req.body.class,
        user: req.body.user,
        status: { $ne: 'rejected' }
      });
      if (existed) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã đăng ký lớp này rồi. Vui lòng chờ duyệt hoặc liên hệ admin.'
        });
      }
    }
    // Kiểm tra nếu đã đủ số lượng học viên
    const classItem = await Class.findById(req.body.class);
    if (classItem && classItem.maxCapacity && classItem.currentMembers.length >= classItem.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Lớp đã đủ số lượng học viên, không thể đăng ký thêm.'
      });
    }
    // Nếu đã bị từ chối thì cho phép đăng ký lại
    const registration = await ClassRegistration.create(req.body);

    // Tạo notification cho admin khi có user đăng ký lớp học
    try {
      await Notification.create({
        title: 'Đăng ký lớp học mới',
        message: `Học viên ${registration.name} vừa đăng ký lớp học!`,
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

// Admin lấy danh sách đăng ký (có thể lọc theo class)
exports.getRegistrations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
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
    const total = await ClassRegistration.countDocuments(filter);
    
    // Lấy dữ liệu theo phân trang
    const registrations = await ClassRegistration.find(filter)
      .populate('class', 'name')
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

// Admin xác nhận đăng ký
exports.acceptRegistration = async (req, res) => {
  try {
    const reg = await ClassRegistration.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });

    // Thêm user vào currentMembers của lớp nếu có userId hợp lệ
    if (reg.user) {
      const classItem = await Class.findById(reg.class);
      if (classItem) {
        // Kiểm tra user đã có trong currentMembers chưa
        const userIdStr = reg.user.toString();
        const existed = classItem.currentMembers.some(u => u.toString() === userIdStr);
        if (!existed) {
          classItem.currentMembers.push(reg.user);
          await classItem.save();
        }
      }
    }
    res.status(200).json({ success: true, data: reg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin từ chối đăng ký
exports.rejectRegistration = async (req, res) => {
  try {
    const reg = await ClassRegistration.findByIdAndUpdate(
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
    const reg = await ClassRegistration.findByIdAndDelete(req.params.id);
    if (!reg) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}; 