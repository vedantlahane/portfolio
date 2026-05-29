const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  year: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  tech: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  github: { 
    type: String, 
    default: '' 
  },
  live: { 
    type: String, 
    default: null 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
