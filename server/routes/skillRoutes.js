const express = require('express');
const router = express.Router();
const { getSkills, createCategory, updateCategory, deleteCategory } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/skills (Public)
router.get('/', getSkills);

// POST /api/skills (Private)
router.post('/', protect, createCategory);

// PUT /api/skills/:id (Private)
router.put('/:id', protect, updateCategory);

// DELETE /api/skills/:id (Private)
router.delete('/:id', protect, deleteCategory);

module.exports = router;
