const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Get Projects Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving projects' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const { title, year, description, tech, type, featured, github, live, order } = req.body;
  
  if (!title || !year || !description || !tech || !type) {
    return res.status(400).json({ message: 'Missing required project fields' });
  }
  
  try {
    const newProject = new Project({
      title,
      year,
      description,
      tech,
      type,
      featured: featured || false,
      github: github || '',
      live: live === '' ? null : live,
      order: order || 0
    });
    
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Create Project Error:', error.message);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, year, description, tech, type, featured, github, live, order } = req.body;
  
  try {
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (title !== undefined) project.title = title;
    if (year !== undefined) project.year = year;
    if (description !== undefined) project.description = description;
    if (tech !== undefined) project.tech = tech;
    if (type !== undefined) project.type = type;
    if (featured !== undefined) project.featured = featured;
    if (github !== undefined) project.github = github;
    if (live !== undefined) project.live = live === '' ? null : live;
    if (order !== undefined) project.order = order;
    
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error('Update Project Error:', error.message);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Note: Project.findByIdAndDelete is safer and works out of the box in Mongoose 8.x
    const result = await Project.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete Project Error:', error.message);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
