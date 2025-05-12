const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: [true, 'Please assign a coach']
  },
  coachName: {
    type: String,
    required: [true, 'Please add a coach name']
  },
  schedule: {
    type: String,
    required: [true, 'Please add a schedule']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Please add a maximum capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  currentMembers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save middleware to ensure coachName is populated if coach is provided
ClassSchema.pre('save', async function(next) {
  if (this.coach && !this.coachName) {
    try {
      const Coach = mongoose.model('Coach');
      const coach = await Coach.findById(this.coach);
      if (coach) {
        this.coachName = coach.name;
      }
    } catch (err) {
      console.error('Error in pre-save middleware:', err);
    }
  }
  next();
});

module.exports = mongoose.model('Class', ClassSchema); 