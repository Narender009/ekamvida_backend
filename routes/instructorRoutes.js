// routes/instructorRoutes.js
const express = require('express');
const router = express.Router();
const InstructorController = require('../controllers/InstructorController');

module.exports = (upload) => {
    // Route to get all instructors
    router.get('/', InstructorController.getAllInstructors);

    // Route to get a single instructor by ID
    router.get('/:id', InstructorController.getInstructorById);

    // Route to create a new instructor with an image
    router.post('/', upload.single('photo'), InstructorController.createInstructor);

    // Route to update an instructor with a new image
    router.put('/:id', upload.single('photo'), InstructorController.updateInstructor);

    // Route to delete an instructor
    router.delete('/:id', InstructorController.deleteInstructor);

    return router;
};
