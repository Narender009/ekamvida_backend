const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
    enum: ['IST', 'BST'],  // Add other timezones as needed
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
