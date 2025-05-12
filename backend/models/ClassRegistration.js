const mongoose = require('mongoose');

const ClassRegistrationSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  experience: { type: String },
  note: { type: String },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClassRegistration', ClassRegistrationSchema); 