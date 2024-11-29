// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /submit - Handle form submission
router.post('/', async (req, res) => {
    const { name, email, public_group, private_group, private_1_1, other, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            public_group,
            private_group,
            private_1_1,
            other,
            message
        });
        
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Error submitting form. Please try again later.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts. Please try again later.' });
    }
});

module.exports = router;
