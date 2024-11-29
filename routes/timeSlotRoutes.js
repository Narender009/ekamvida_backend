const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

// Get all time slots, with optional filters for date and timezone
router.get('/', async (req, res) => {
  try {
    const { date, timezone } = req.query;
    const query = {};

    if (date) {
      query.date = new Date(date);
    }

    if (timezone) {
      query.timezone = timezone;
    }

    const timeSlots = await TimeSlot.find(query);
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific time slot by ID
router.get('/:id', async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);
    if (!timeSlot) return res.status(404).json({ message: 'TimeSlot not found' });
    res.json(timeSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new time slot
router.post('/', async (req, res) => {
  const { date, time, timezone, isAvailable } = req.body;
  const timeSlot = new TimeSlot({
    date: new Date(date),
    time,
    timezone,
    isAvailable,
  });

  try {
    const newTimeSlot = await timeSlot.save();
    res.status(201).json(newTimeSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a time slot by ID
router.put('/:id', async (req, res) => {
  try {
    const { date, time, timezone, isAvailable } = req.body;
    const timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) return res.status(404).json({ message: 'TimeSlot not found' });

    if (date) timeSlot.date = new Date(date);
    if (time) timeSlot.time = time;
    if (timezone) timeSlot.timezone = timezone;
    if (isAvailable !== undefined) timeSlot.isAvailable = isAvailable;

    const updatedTimeSlot = await timeSlot.save();
    res.json(updatedTimeSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a time slot by ID
// Delete a time slot by ID
router.delete('/:id', async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({ message: 'TimeSlot not found' });
    }

    res.json({ message: 'TimeSlot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
