// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    public_group: {
        type: Boolean,
        default: false,
    },
    private_group: {
        type: Boolean,
        default: false,
    },
    private_1_1: {
        type: Boolean,
        default: false,
    },
    other: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
