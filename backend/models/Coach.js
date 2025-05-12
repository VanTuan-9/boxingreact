const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    enum: ['Boxing', 'Kickboxing', 'MMA', 'Muay Thai', 'Fitness', 'Other']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  achievements: {
    type: [String],
    default: []
  },
  certifications: {
    type: [String],
    default: []
  },
  profileImage: {
    type: String,
    default: 'default-coach.jpg'
  },
  contactEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  socialMedia: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],
    default: 'active'
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coach', CoachSchema); 