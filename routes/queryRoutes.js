const express = require('express');
const Query = require('../models/Query');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// POST route to submit a query
router.post('/', async (req, res) => {
    const { name, email, query, category } = req.body;
  
    if (!name || !email || !query || !category) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }
  
    try {
      // Save query to the database
      const newQuery = new Query({ name, email, query, category });
      await newQuery.save();
  
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Email to the user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Query Received - Thank You!',
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for reaching out to us under the category: <strong>${category}</strong>.</p>
          <p>We have received your query:</p>
          <blockquote>${query}</blockquote>
          <p>Our team will get back to you shortly.</p>
          <p>Best regards,<br>Your Support Team</p>
        `,
      };
  
      // Email to the support team
      const supportMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Query from ${name} [Category: ${category}]`,
        html: `
          <h3>New Query Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Query:</strong> ${query}</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        `,
      };
  
      // Send both emails
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(supportMailOptions);
  
      return res.status(200).json({ status: 'success', message: 'Query submitted and emails sent successfully.' });
    } catch (error) {
      console.error('Error saving query or sending emails:', error);
      return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again later.' });
    }
  });
  

module.exports = router;
