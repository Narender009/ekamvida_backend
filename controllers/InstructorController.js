// controllers/InstructorController.js
const Instructor = require('../models/Instructor');

// Get all instructors
exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find();
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get instructor by ID
exports.getInstructorById = async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json(instructor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new instructor
exports.createInstructor = async (req, res) => {
    const { name, bio, experienceLevel, specialties, contactEmail, contactPhone } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

    const instructor = new Instructor({ name, bio, photo, experienceLevel, specialties, contactEmail, contactPhone });

    try {
        const newInstructor = await instructor.save();
        res.status(201).json(newInstructor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update instructor by ID
exports.updateInstructor = async (req, res) => {
    const { name, bio, experienceLevel, specialties, contactEmail, contactPhone } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const updateData = { name, bio, experienceLevel, specialties, contactEmail, contactPhone };
        if (photo) updateData.photo = photo;

        const instructor = await Instructor.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        res.status(200).json(instructor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete instructor by ID
exports.deleteInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findByIdAndDelete(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
