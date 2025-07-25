const express = require('express');
const router = express.Router();
// Import all three controller functions
const {
  syncTemplates,
  createTemplate,
  updateTemplate,
  getAllTemplates,
  getTemplateById,
  getTemplateTitles,
  startJob,
  updateActiveJob,
  getTemplatebyId,
  
} = require('../controllers/templateController');


// POST /api/templates/sync - Syncs from external source
router.post('/sync', syncTemplates);

router.get('/titles', getTemplateTitles);

// POST /api/templates - Creates a new template
router.post('/', createTemplate);

// PUT /api/templates/:id - Updates an existing template by its ID
router.put('/:id', updateTemplate);

router.get('/', getAllTemplates); 

router.get('/:id', getTemplateById); 

router.post('/start-job', startJob);

router.put('/active-job/:jobId', updateActiveJob);

router.get('/:id', getTemplatebyId);

module.exports = router;