const mongoose = require('mongoose');

// Define the Schedule schema
const scheduleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    timezone: {
        type: String,
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true,
    }
});

// Create and export the Schedule model
const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;

