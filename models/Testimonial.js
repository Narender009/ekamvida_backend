const mongoose = require('mongoose');

// Define the schema for testimonials
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
