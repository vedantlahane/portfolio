const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'fallback_secret_key_123456', 
    { expiresIn: '30d' }
  );
};

// @desc    Auth admin via passkey or credentials & get token
// @route   POST /api/auth/login, POST /api/auth/unlock
// @access  Public
exports.login = async (req, res) => {
  const { email, password, passkey } = req.body;
  const configuredPasskey = process.env.ADMIN_PASSKEY || '7447';

  // 1. Passkey Authentication (Instant Unlock)
  if (passkey !== undefined) {
    if (String(passkey).trim() !== String(configuredPasskey).trim()) {
      return res.status(401).json({ message: 'Invalid passkey' });
    }

    try {
      let admin = await Admin.findOne();
      if (!admin) {
        admin = new Admin({
          email: process.env.ADMIN_EMAIL || 'admin@portfolio.local',
          password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10),
          username: 'admin'
        });
        await admin.save();
      }

      return res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } catch (error) {
      console.error('Passkey Auth Error:', error.message);
      return res.status(500).json({ message: 'Server error during passkey authentication' });
    }
  }

  // 2. Email & Password Authentication (Fallback)
  if (!email || !password) {
    return res.status(400).json({ message: 'Passkey or email/password required' });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log(`❌ Login failed: No admin found with email "${email}"`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`❌ Login failed: Password mismatch for email "${email}"`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.unlock = exports.login;

// @desc    Verify admin token
// @route   GET /api/auth/verify
// @access  Private (using protect middleware)
exports.verify = async (req, res) => {
  res.status(200).json({
    status: 'success',
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email
    }
  });
};
