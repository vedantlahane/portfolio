const express = require('express');
const router = express.Router();
const { getAllData, updateAllData } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/admin/data - Fetch all portfolio data
router.get('/data', protect, getAllData);

// PUT /api/admin/data - Bulk update all portfolio data
router.put('/data', protect, updateAllData);

module.exports = router;
