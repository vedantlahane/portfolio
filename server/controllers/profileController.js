const Profile = require('../models/Profile');

// @desc    Get profile data
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = new Profile();
      await profile.save();
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update profile data
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      // Update fields
      const fields = [
        'greeting', 'name', 'roles', 'heroDescription', 'cvLink', 'statusIndicators',
        'experiences', 'featuredSkills', 'me2StatusLabels', 'aboutSubhead', 'aboutText', 'highlightKeywords'
      ];
      
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          profile[field] = req.body[field];
        }
      });
      
      profile.updatedAt = Date.now();
    }
    
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
