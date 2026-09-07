const Profile = require('../models/Profile');
const Project = require('../models/Project');
const SkillCategory = require('../models/SkillCategory');

// @desc    Get all portfolio data for direct JSON editing
// @route   GET /api/admin/data
// @access  Private (protect)
exports.getAllData = async (req, res) => {
  try {
    let profile = await Profile.findOne().select('-__v');
    if (!profile) {
      profile = new Profile();
      await profile.save();
    }
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).select('-__v');
    const skills = await SkillCategory.find().sort({ order: 1 }).select('-__v');

    res.status(200).json({
      profile,
      projects,
      skills
    });
  } catch (error) {
    console.error('Get All Data Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving data' });
  }
};

// @desc    Bulk update portfolio data from JSON
// @route   PUT /api/admin/data
// @access  Private (protect)
exports.updateAllData = async (req, res) => {
  const { profile, projects, skills } = req.body;

  try {
    // 1. Update Profile if provided
    if (profile && typeof profile === 'object') {
      let existingProfile = await Profile.findOne();
      if (!existingProfile) {
        existingProfile = new Profile(profile);
      } else {
        const fields = [
          'greeting', 'name', 'roles', 'heroDescription', 'cvLink', 'statusIndicators',
          'experiences', 'featuredSkills', 'me2StatusLabels', 'aboutSubhead', 'aboutText',
          'highlightKeywords', 'email', 'phone'
        ];
        fields.forEach(field => {
          if (profile[field] !== undefined) {
            existingProfile[field] = profile[field];
          }
        });
        existingProfile.updatedAt = Date.now();
      }
      await existingProfile.save();
    }

    // 2. Update Projects if provided
    if (Array.isArray(projects)) {
      await Project.deleteMany({});
      const sanitizedProjects = projects.map((p, idx) => ({
        title: p.title || 'Untitled Project',
        year: p.year || new Date().getFullYear().toString(),
        description: p.description || '',
        tech: p.tech || '',
        type: p.type || 'Project',
        featured: p.featured || false,
        github: p.github || '',
        live: p.live === '' ? null : p.live,
        order: p.order !== undefined ? p.order : idx
      }));
      await Project.insertMany(sanitizedProjects);
    }

    // 3. Update Skills if provided
    if (Array.isArray(skills)) {
      await SkillCategory.deleteMany({});
      const sanitizedSkills = skills.map((s, idx) => ({
        key: s.key || (s.title ? s.title.toLowerCase().replace(/[^a-z0-9]/g, '_') : `cat_${idx}`),
        title: s.title || 'Category',
        skills: Array.isArray(s.skills) ? s.skills : [],
        order: s.order !== undefined ? s.order : idx
      }));
      await SkillCategory.insertMany(sanitizedSkills);
    }

    // Return the updated data
    const updatedProfile = await Profile.findOne().select('-__v');
    const updatedProjects = await Project.find().sort({ order: 1, createdAt: -1 }).select('-__v');
    const updatedSkills = await SkillCategory.find().sort({ order: 1 }).select('-__v');

    res.status(200).json({
      status: 'success',
      message: 'Portfolio data updated successfully',
      data: {
        profile: updatedProfile,
        projects: updatedProjects,
        skills: updatedSkills
      }
    });
  } catch (error) {
    console.error('Bulk Update Data Error:', error.message);
    res.status(500).json({ message: 'Server error updating data: ' + error.message });
  }
};
