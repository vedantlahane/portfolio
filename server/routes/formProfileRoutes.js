const express = require('express');
const router = express.Router();
const {
  protectFormProfile,
  getFormProfile,
  updateFormProfile,
  quickAddField,
  generateExtensionKey,
  aiGenerateAnswer
} = require('../controllers/formProfileController');

// All form-profile routes are protected by JWT or Extension API Key
router.use(protectFormProfile);

// GET /api/form-profile - Fetch merged public + private profile for form filling
router.get('/', getFormProfile);

// PUT /api/form-profile - Update private form-filling profile
router.put('/', updateFormProfile);

// POST /api/form-profile/quick-add - Extension quick-add newly discovered field
router.post('/quick-add', quickAddField);

// POST /api/form-profile/generate-key - Regenerate Extension API Key
router.post('/generate-key', generateExtensionKey);

// POST /api/form-profile/ai-generate - Generate grounded answers for subjective questions
router.post('/ai-generate', aiGenerateAnswer);

module.exports = router;
