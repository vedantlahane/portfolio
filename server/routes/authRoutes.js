const express = require('express');
const router = express.Router();
const { login, unlock, verify } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/login & /api/auth/unlock
router.post('/login', login);
router.post('/unlock', unlock || login);

// GET /api/auth/verify
router.get('/verify', protect, verify);

module.exports = router;
