// contactController.js
const Contact = require('../models/Contact');

// Handle Contact Form Submission
exports.submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};