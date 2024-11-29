// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');

// Multer configuration for storing event images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route for fetching events (upcoming or past)
router.get('/', eventController.getEvents);

// Route for adding a new event with image upload
router.post('/', upload.single('image'), eventController.addEvent);

// Route for updating an event with image upload
router.put('/:id', upload.single('image'), eventController.updateEvent);

// Route for deleting an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
