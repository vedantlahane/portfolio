const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/projects (Public)
router.get('/', getProjects);

// POST /api/projects (Private)
router.post('/', protect, createProject);

// PUT /api/projects/:id (Private)
router.put('/:id', protect, updateProject);

// DELETE /api/projects/:id (Private)
router.delete('/:id', protect, deleteProject);

module.exports = router;
