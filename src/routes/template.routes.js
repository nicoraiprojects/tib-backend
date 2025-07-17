const express = require('express');
const router = express.Router();
// Import all three controller functions
const {
  syncTemplates,
  createTemplate,
  updateTemplate,
  getAllTemplates,
  getTemplateById
} = require('../controllers/templateController');

// POST /api/templates/sync - Syncs from external source
router.post('/sync', syncTemplates);

// POST /api/templates - Creates a new template
router.post('/', createTemplate);

// PUT /api/templates/:id - Updates an existing template by its ID
router.put('/:id', updateTemplate);

router.get('/', getAllTemplates); 

router.get('/:id', getTemplateById); 

module.exports = router;