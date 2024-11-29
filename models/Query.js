const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Payment Issue', 'Booking Issue', 'Class Availability', 'General Inquiry'], // Valid categories
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Query', querySchema);
