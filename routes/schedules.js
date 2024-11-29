const express = require('express');
const Schedule = require('../models/Schedule');
const router = express.Router();

// Get all schedules with populated service and instructor fields
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('service').populate('instructor');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new schedule
router.post('/', async (req, res) => {
    const { date, day, start_time, end_time, timezone, service, instructor } = req.body;
    const schedule = new Schedule({
        date,
        day,
        start_time,
        end_time,
        timezone,
        service,
        instructor,
    });

    try {
        const newSchedule = await schedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a schedule by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('service')
            .populate('instructor');
        res.json(updatedSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a schedule by ID
router.delete('/:id', async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
