const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  skills: { 
    type: [String], 
    required: true 
  },
  order: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
