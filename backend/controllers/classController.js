const Class = require('../models/Class');
const User = require('../models/User');
const Coach = require('../models/Coach');
const ClassRegistration = require('../models/ClassRegistration');

// @desc    Get all classes (admin view)
// @route   GET /api/classes/admin/list
// @access  Private/Admin
exports.getAdminClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Xử lý tìm kiếm nếu có search param
    let searchQuery = {};
    if (req.query.search && req.query.field) {
      searchQuery[req.query.field] = { $regex: req.query.search, $options: 'i' };
    }
    
    const total = await Class.countDocuments(searchQuery);

    const classes = await Class.find(searchQuery)
      .populate('currentMembers', 'name email')
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: classes.length,
      pagination,
      total,
      totalPages: Math.ceil(total / limit),
      classes: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all classes (public view)
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Xử lý tìm kiếm nếu có search param
    let searchQuery = {};
    if (req.query.search) {
      searchQuery = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { coachName: { $regex: req.query.search, $options: 'i' } },
          { schedule: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    
    const total = await Class.countDocuments(searchQuery);

    const classes = await Class.find(searchQuery)
      .populate('currentMembers', 'name email')
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: classes.length,
      pagination,
      total,
      classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('currentMembers', 'name email');

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
exports.createClass = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'coach', 'coachName', 'schedule', 'maxCapacity', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate coach exists
    const coach = await Coach.findById(req.body.coach);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Validate maxCapacity
    if (req.body.maxCapacity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Maximum capacity must be at least 1'
      });
    }

    // Xử lý file ảnh
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // Create class
    const classItem = await Class.create(req.body);

    res.status(201).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res) => {
  try {
    // Xử lý file ảnh nếu có
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const classItem = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    await classItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add member to class
// @route   POST /api/classes/:id/members/:userId
// @access  Private/Admin
exports.addMember = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    const user = await User.findById(req.params.userId);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if class is full
    if (classItem.currentMembers.length >= classItem.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is at maximum capacity'
      });
    }

    // Check if user is already in class
    if (classItem.currentMembers.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already in this class'
      });
    }

    classItem.currentMembers.push(req.params.userId);
    await classItem.save();

    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove member from class
// @route   DELETE /api/classes/:id/members/:userId
// @access  Private/Admin
exports.removeMember = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if user is in class
    if (!classItem.currentMembers.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not in this class'
      });
    }

    // Remove user from class
    classItem.currentMembers = classItem.currentMembers.filter(
      member => member.toString() !== req.params.userId
    );

    await classItem.save();

    // Xóa luôn bản ghi đăng ký lớp học tương ứng
    await ClassRegistration.deleteMany({ class: req.params.id, user: req.params.userId });

    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin create class
// @route   POST /api/classes/admin/create
// @access  Private/Admin
exports.adminCreateClass = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'coach', 'schedule', 'maxCapacity', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate coach exists
    const coach = await Coach.findById(req.body.coach);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Add coachName from coach document
    req.body.coachName = coach.name;

    // Validate maxCapacity
    if (req.body.maxCapacity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Maximum capacity must be at least 1'
      });
    }

    // Create class
    const classItem = await Class.create(req.body);

    res.status(201).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Test create class (no auth required)
// @route   POST /api/classes/test/create
// @access  Public
exports.testCreateClass = async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log('Test creating class with data:', req.body);
    
    // Check for required fields
    const { name, coach, coachName, schedule, maxCapacity, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    if (!coach && !coachName) {
      return res.status(400).json({
        success: false,
        message: 'Coach is required'
      });
    }
    
    if (!schedule) {
      return res.status(400).json({
        success: false,
        message: 'Schedule is required'
      });
    }
    
    if (!maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Max capacity is required'
      });
    }
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Convert maxCapacity to a number
    const classData = {
      ...req.body,
      maxCapacity: parseInt(maxCapacity, 10),
      currentMembers: [] // Ensure the currentMembers array is initialized
    };

    // If coach ID is provided, use it and look up the coach name
    if (coach) {
      try {
        const coachDoc = await Coach.findById(coach);
        if (!coachDoc) {
          return res.status(404).json({
            success: false,
            message: 'Coach not found with the provided ID'
          });
        }
        classData.coach = coach;
        classData.coachName = coachDoc.name;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coach ID format'
        });
      }
    } else if (coachName) {
      // If only coach name is provided, try to find coach by name
      const coachDoc = await Coach.findOne({ name: coachName });
      if (coachDoc) {
        classData.coach = coachDoc._id;
      } else {
        // Create without coach reference if coach not found
        delete classData.coach;
      }
    }

    // Create the class
    const classItem = await Class.create(classData);
    console.log('Class created:', classItem);

    // If we have a valid coach reference, update the coach's classes
    if (classItem.coach) {
      await Coach.findByIdAndUpdate(
        classItem.coach,
        { $push: { classes: classItem._id } }
      );
    }

    res.status(201).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    console.error('Error creating class:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Seed classes for testing
// @route   GET /api/classes/seed
// @access  Public
exports.seedClasses = async (req, res) => {
  try {
    // Check if there are already classes
    const count = await Class.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `${count} classes already exist`
      });
    }

    // Get coaches from database
    const coaches = await Coach.find();
    
    if (coaches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please seed coaches first using /api/coaches/seed'
      });
    }

    // Sample classes data
    const sampleClasses = [
      {
        name: 'Boxing Basics',
        coach: coaches[0]._id,
        coachName: coaches[0].name,
        schedule: 'Mon, Wed, Fri 10:00 - 11:30',
        maxCapacity: 20,
        description: 'Introductory class for beginners',
        currentMembers: []
      },
      {
        name: 'Advanced Techniques',
        coach: coaches.length > 1 ? coaches[1]._id : coaches[0]._id,
        coachName: coaches.length > 1 ? coaches[1].name : coaches[0].name,
        schedule: 'Tue, Thu 18:00 - 20:00',
        maxCapacity: 15,
        description: 'For experienced boxers looking to refine their skills',
        currentMembers: []
      },
      {
        name: 'Cardio Boxing',
        coach: coaches.length > 2 ? coaches[2]._id : coaches[0]._id,
        coachName: coaches.length > 2 ? coaches[2].name : coaches[0].name,
        schedule: 'Mon, Wed, Fri 16:00 - 17:30',
        maxCapacity: 25,
        description: 'High-intensity workout focusing on cardio and conditioning',
        currentMembers: []
      }
    ];

    // Insert the sample classes
    const classes = await Class.create(sampleClasses);

    // Update coaches with classes they teach
    for (const classItem of classes) {
      await Coach.findByIdAndUpdate(
        classItem.coach,
        { $push: { classes: classItem._id } }
      );
    }

    res.status(201).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error seeding classes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};