const Coach = require('../models/Coach');
const Class = require('../models/Class');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
exports.getCoaches = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Coach.countDocuments();

    const coaches = await Coach.find()
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
      count: coaches.length,
      pagination,
      total,
      data: coaches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single coach
// @route   GET /api/coaches/:id
// @access  Public
exports.getCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).populate('classes');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new coach
// @route   POST /api/coaches
// @access  Private/Admin
exports.createCoach = async (req, res) => {
  try {
    console.log('Creating coach with data:', req.body);
    console.log('File upload:', req.file);

    // Validate required fields
    const requiredFields = ['name', 'specialization', 'experience', 'bio'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate specialization
    const validSpecializations = ['Boxing', 'Kickboxing', 'MMA', 'Muay Thai', 'Fitness', 'Other'];
    if (!validSpecializations.includes(req.body.specialization)) {
      console.log('Invalid specialization:', req.body.specialization);
      return res.status(400).json({
        success: false,
        message: 'Invalid specialization'
      });
    }

    // Validate experience
    if (req.body.experience < 0) {
      console.log('Invalid experience:', req.body.experience);
      return res.status(400).json({
        success: false,
        message: 'Experience cannot be negative'
      });
    }

    // Validate bio length
    if (req.body.bio.length > 500) {
      console.log('Bio too long:', req.body.bio.length);
      return res.status(400).json({
        success: false,
        message: 'Bio cannot be more than 500 characters'
      });
    }

    // Handle file upload
    if (req.file) {
      console.log('File uploaded:', req.file);
      req.body.profileImage = req.file.filename;
    } else {
      console.log('No file uploaded, using default image');
      req.body.profileImage = 'default-coach.jpg';
    }

    // Create coach
    console.log('Creating coach with final data:', req.body);
    const coach = await Coach.create(req.body);
    console.log('Coach created successfully:', coach);

    res.status(201).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error creating coach:', error);
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

// @desc    Update coach
// @route   PUT /api/coaches/:id
// @access  Private/Admin
exports.updateCoach = async (req, res) => {
  try {
    // Handle file upload
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }

    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coach
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

// @desc    Delete coach
// @route   DELETE /api/coaches/:id
// @access  Private/Admin
exports.deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Find classes associated with this coach
    const classes = await Class.find({ coach: req.params.id });
    
    if (classes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete coach as they are assigned to classes. Please reassign or delete those classes first.'
      });
    }

    await coach.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Seed coaches (for testing)
// @route   GET /api/coaches/seed
// @access  Public
exports.seedCoaches = async (req, res) => {
  try {
    // Check if there are already coaches
    const count = await Coach.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `${count} coaches already exist`
      });
    }

    // Sample coaches data
    const sampleCoaches = [
      {
        name: 'John Smith',
        specialization: 'Boxing',
        experience: 15,
        bio: 'Former professional boxer with 15 years of coaching experience.',
        achievements: ['National Boxing Champion 2005', 'Olympic Bronze Medalist 2008'],
        certifications: ['USA Boxing Level 2 Coach', 'CPR Certified'],
        status: 'active'
      },
      {
        name: 'Mike Tyson',
        specialization: 'Boxing',
        experience: 20,
        bio: 'Legendary heavyweight champion with a passion for teaching the next generation.',
        achievements: ['Heavyweight World Champion', '50 Professional Wins'],
        certifications: ['International Boxing Federation Coach', 'Sports Nutrition Certified'],
        status: 'active'
      },
      {
        name: 'Jane Doe',
        specialization: 'Fitness',
        experience: 8,
        bio: 'Fitness enthusiast with expertise in high-intensity boxing workouts.',
        achievements: ['Fitness Trainer of the Year 2019', 'Marathon Runner'],
        certifications: ['Personal Trainer Certification', 'Group Fitness Instructor'],
        status: 'active'
      }
    ];

    // Insert the sample coaches
    const coaches = await Coach.create(sampleCoaches);

    res.status(201).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('Error seeding coaches:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 