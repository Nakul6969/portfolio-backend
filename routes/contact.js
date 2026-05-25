const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

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

    const transporter = createTransporter();

    if (!transporter) {
      console.warn('Contact message saved, but email notification is disabled because EMAIL_USER or EMAIL_PASS is missing.');
      return res.status(201).json({ message: 'Message saved successfully.' });
    }

    try {
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
    } catch (mailError) {
      console.error('Contact saved, but email notification failed:', mailError);
      return res.status(201).json({ message: 'Message saved successfully.' });
    }

    return res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
