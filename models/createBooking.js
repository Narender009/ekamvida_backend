// models/booking.js
const mongoose = require('mongoose');

const createBookingSchema = new mongoose.Schema({
    clientDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String },
        smsReminder: { type: Boolean, default: false }
    },
    schedule: {
        service: {
            service_name: { type: String, required: true },
            // You can add additional service-related fields here
        },
        instructor: {
            name: { type: String, required: true },
            // Additional instructor details can be added here if needed
        },
        date: { type: Date, required: true },
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
        timezone: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'approve', 'decline'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('createBooking', createBookingSchema);
