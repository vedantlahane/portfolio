const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/profile (Public)
router.get('/', getProfile);

// PUT /api/profile (Private)
router.put('/', protect, updateProfile);

module.exports = router;
