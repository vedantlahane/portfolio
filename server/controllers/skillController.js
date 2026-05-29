const SkillCategory = require('../models/SkillCategory');

// @desc    Get all skill categories
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
  try {
    const categories = await SkillCategory.find().sort({ order: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get Skills Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving skills' });
  }
};

// @desc    Create a skill category
// @route   POST /api/skills
// @access  Private
exports.createCategory = async (req, res) => {
  const { key, title, skills, order } = req.body;
  
  if (!key || !title || !skills) {
    return res.status(400).json({ message: 'Missing required skill category fields' });
  }
  
  try {
    // Check if key already exists
    const exists = await SkillCategory.findOne({ key });
    if (exists) {
      return res.status(400).json({ message: 'Category key already exists' });
    }
    
    const newCategory = new SkillCategory({
      key,
      title,
      skills,
      order: order || 0
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Create Category Error:', error.message);
    res.status(500).json({ message: 'Server error creating category' });
  }
};

// @desc    Update a skill category
// @route   PUT /api/skills/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { key, title, skills, order } = req.body;
  
  try {
    const category = await SkillCategory.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (key !== undefined) category.key = key;
    if (title !== undefined) category.title = title;
    if (skills !== undefined) category.skills = skills;
    if (order !== undefined) category.order = order;
    
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error('Update Category Error:', error.message);
    res.status(500).json({ message: 'Server error updating category' });
  }
};

// @desc    Delete a skill category
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await SkillCategory.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete Category Error:', error.message);
    res.status(500).json({ message: 'Server error deleting category' });
  }
};
