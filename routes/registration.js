const express = require('express');
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event'); // Assuming you have an Event model
const router = express.Router();

// Get all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().populate('event');
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching registrations' });
  }
});

// Get a specific registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the registration' });
  }
});

// Create a new registration
router.post('/', async (req, res) => {
  const { name, email, phone, event, title, date, time, location } = req.body;

  try {
    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const newRegistration = new Registration({
      name,
      email,
      phone,
      event,
      title,
      date,
      time,
      location,
    });

    await newRegistration.save();
    res.status(201).json({ message: 'Registration successful', registration: newRegistration });
  } catch (error) {
    console.error('Error creating registration:', error); // Log detailed error to console
    res.status(500).json({ error: 'Error creating registration', details: error.message });
  }
});


// Update a registration by ID
router.put('/:id', async (req, res) => {
  const { name, email, phone, event, title, date, time, location } = req.body;

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    if (event) {
      const existingEvent = await Event.findById(event);
      if (!existingEvent) return res.status(404).json({ error: 'Event not found' });
    }

    registration.name = name || registration.name;
    registration.email = email || registration.email;
    registration.phone = phone || registration.phone;
    registration.event = event || registration.event;
    registration.title = title || registration.title;
    registration.date = date || registration.date;
    registration.time = time || registration.time;
    registration.location = location || registration.location;

    await registration.save();
    res.status(200).json({ message: 'Registration updated successfully', registration });
  } catch (error) {
    res.status(500).json({ error: 'Error updating registration', details: error.message });
  }
});

// Delete a registration by ID
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting registration', details: error.message });
  }
});

module.exports = router;
