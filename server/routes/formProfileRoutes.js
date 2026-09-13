const express = require('express');
const router = express.Router();
const {
  protectFormProfile,
  getFormProfile,
  updateFormProfile,
  quickAddField,
  generateExtensionKey,
  aiGenerateAnswer,
  addKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
  testAiConnection,
  suggestKnowledgeCategorization,
  aiResolveField
} = require('../controllers/formProfileController');

// All form-profile routes are protected by JWT or Extension API Key
router.use(protectFormProfile);

// Core profile CRUD
router.get('/', getFormProfile);
router.put('/', updateFormProfile);
router.post('/quick-add', quickAddField);
router.post('/generate-key', generateExtensionKey);

// Knowledge Vault routes
router.post('/knowledge', addKnowledgeItem);
router.put('/knowledge/:id', updateKnowledgeItem);
router.delete('/knowledge/:id', deleteKnowledgeItem);

// AI Assistance & Diagnostics routes
router.post('/ai-generate', aiGenerateAnswer);
router.post('/ai-test', testAiConnection);
router.post('/ai-categorize', suggestKnowledgeCategorization);
router.post('/ai-resolve-field', aiResolveField);

module.exports = router;
