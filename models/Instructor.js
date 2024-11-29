// models/Instructor.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    photo: {
        type: String, // URL to the instructor's photo
        default: 'https://example.com/default-photo.jpg' // A default photo URL (optional)
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    },
    specialties: {
        type: [String], // Array of specialties (e.g., ['Yoga', 'Pilates', 'Strength Training'])
    },
    contactEmail: {
        type: String,
        required: true,
        unique: true
    },
    contactPhone: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Instructor', InstructorSchema);
