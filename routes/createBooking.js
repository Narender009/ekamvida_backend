// routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/createBooking');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { clientDetails, schedule } = req.body;

        const newBooking = new Booking({
            clientDetails,
            schedule
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a booking by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // returns the modified document
            runValidators: true
        });
        if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a booking by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search bookings by client name (optional, for search functionality)
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        const bookings = await Booking.find({ 'clientDetails.name': { $regex: name, $options: 'i' } });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'complete', 'approve', 'decline'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking status updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update booking status', error: error.message });
    }
});

module.exports = router;
