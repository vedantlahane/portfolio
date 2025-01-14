// blogRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// POST /api/blogs
router.post('/', createBlog);

// GET /api/blogs
router.get('/', getAllBlogs);

// GET /api/blogs/:id
router.get('/:id', getBlogById);

// PUT /api/blogs/:id
router.put('/:id', updateBlog);

// DELETE /api/blogs/:id
router.delete('/:id', deleteBlog);

module.exports = router;