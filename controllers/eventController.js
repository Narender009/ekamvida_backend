// controllers/eventController.js
const Event = require('../models/Event');
const path = require('path');

// Fetch upcoming or past events
exports.getEvents = async (req, res) => {
  try {
    const { view } = req.query;
    const currentDate = new Date();
    const query = view === 'upcoming' ? { date: { $gte: currentDate } } : { date: { $lt: currentDate } };

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      image,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully!', event: newEvent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add event' });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, date, time, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined; // Only update if a new file is uploaded

    const updatedData = { title, description, date, time, location };
    if (image) updatedData.image = image;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event updated successfully!', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
