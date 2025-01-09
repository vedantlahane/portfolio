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
router.post('/blogs', createBlog);

// GET /api/blogs
router.get('/blogs', getAllBlogs);

// GET /api/blogs/:id
router.get('/blogs/:id', getBlogById);

// PUT /api/blogs/:id
router.put('/blogs/:id', updateBlog);

// DELETE /api/blogs/:id
router.delete('/blogs/:id', deleteBlog);

module.exports = router;