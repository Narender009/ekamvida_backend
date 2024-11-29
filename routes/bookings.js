const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get a booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/status', bookingController.updateBookingStatus); // Optional

// Update booking (full update)
router.put('/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

// // Get user's booking history
// router.get('/user/:userId', bookingController.getBookingsByUserId);

// // Cancel booking by user
// router.patch('/:id/cancel', bookingController.cancelBooking);


module.exports = router;
