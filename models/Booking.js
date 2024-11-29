// models/Booking.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  client_name: {
    type: String,
    required: true,
    trim: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service', // Reference to the Service model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  client_phone: {
    type: String,
    required: true,
  },
  client_email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  smsReminder: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'complete', 'approve', 'decline'],
    default: 'pending',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Booking', BookingSchema);
