const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST contact form
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  
  const contact = new Contact({
    name,
    email,
    message
  });
  
  try {
    await contact.save();
    
    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
    
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;