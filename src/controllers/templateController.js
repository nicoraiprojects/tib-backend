// const axios = require('axios');
// const Template = require('../model/templateModel'); // Assuming you have a Template model defined
// /**
//  * @desc    Creates a new template document in the database.
//  * @route   POST /api/templates
//  * @access  Public
//  */
// const createTemplate = async (req, res) => {
//   try {
//     // The full template object, including the frontend-generated ID, is in the request body.
//     const newTemplateData = req.body;

//     if (!newTemplateData.id || !newTemplateData.title) {
//         return res.status(400).json({ success: false, message: 'Template ID and title are required.' });
//     }

//     // Map the frontend 'id' to our schema's 'templateId' field.
//     const templateToSave = new Template({
//         templateId: newTemplateData.id,
//         title: newTemplateData.title,
//         pages: newTemplateData.pages,
//         globalStyles: newTemplateData.globalStyles,
//         lastModified: newTemplateData.lastModified,
//     });

//     const savedTemplate = await templateToSave.save();

//     // Respond with 201 (Created) and the newly saved document.
//     res.status(201).json(savedTemplate);
//   } catch (error) {
//     console.error('Error creating template:', error);
//     // Handle potential duplicate key errors
//     if (error.code === 11000) {
//         return res.status(409).json({ success: false, message: 'A template with this ID already exists.' });
//     }
//     res.status(500).json({ success: false, message: 'Failed to create template.', error: error.message });
//   }
// };

// /**
//  * @desc    Updates an existing template in the database.
//  * @route   PUT /api/templates/:id
//  * @access  Public
//  */
// const updateTemplate = async (req, res) => {
//   try {
//     const templateId = req.params.id;
//     const templateUpdates = req.body;

//     // Use findOneAndUpdate to find by our custom `templateId` and update.
//     // The `new: true` option ensures the updated document is returned.
//     const updatedTemplate = await Template.findOneAndUpdate(
//         { templateId: templateId },
//         templateUpdates,
//         { new: true, runValidators: true }
//     );

//     if (!updatedTemplate) {
//         return res.status(404).json({ success: false, message: 'Template not found for update.' });
//     }

//     res.status(200).json(updatedTemplate);
//   } catch (error) {
//     console.error('Error updating template:', error);
//     res.status(500).json({ success: false, message: 'Failed to update template.', error: error.message });
//   }
// };

// const getAllTemplates = async (req, res) => {
//   try {
//     // Find all templates. We can use .select() to choose which fields to return
//     // to keep the payload smaller for a list view.
//     const templates = await Template.find({}).select('templateId title lastModified'); // Only send essential data for a list
    
//     // The frontend expects the main ID to be 'id', so we map it.
//     const templatesWithId = templates.map(t => ({
//         id: t.templateId,
//         title: t.title,
//         lastModified: t.lastModified,
//         // Include other fields from the select() if needed
//     }));

//     res.status(200).json(templatesWithId);
//   } catch (error) {
//     console.error('Error fetching all templates:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch templates.', error: error.message });
//   }
// };

// /**
//  * @desc    Fetches templates from the external JSON server and syncs them.
//  * @route   POST /api/templates/sync
//  * @access  Public
//  */
// const syncTemplates = async (req, res) => {
//   // This function remains the same as before...
//   try {
//     console.log('Starting template synchronization...');
//     const templateUrl = 'https://json-server.nicor.ai/templates/tib_form_templates';

//     const response = await axios.get(templateUrl);
//     const externalTemplates = response.data;

//     if (!Array.isArray(externalTemplates)) {
//       throw new Error('Fetched data is not an array of templates.');
//     }

//     let successCount = 0;
//     const operations = externalTemplates.map(async (template) => {
//       const filter = { templateId: template.id };
//       const update = {
//         title: template.title,
//         lastModified: template.lastModified,
//         pages: template.pages,
//         globalStyles: template.globalStyles,
//       };
//       await Template.findOneAndUpdate(filter, update, { new: true, upsert: true });
//       successCount++;
//     });

//     await Promise.all(operations);

//     console.log(`Synchronization complete. ${successCount} templates processed.`);
//     res.status(200).json({
//       success: true,
//       message: `Successfully synced ${successCount} templates with the database.`,
//     });

//   } catch (error) {
//     console.error('Error during template synchronization:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to synchronize templates.',
//       error: error.message,
//     });
//   }
// };
// const getTemplateById = async (req, res) => {
//   try {
//     // Find a single document where our custom `templateId` matches the ID from the URL params.
//     const template = await Template.findOne({ templateId: req.params.id });

//     if (!template) {
//       // If no template is found, return a 404 error.
//       return res.status(404).json({ success: false, message: 'Template not found' });
//     }
    
//     // The frontend expects the main ID field to be named 'id'.
//     // We transform the data before sending it back to match the frontend's expectation.
//     const responseObject = template.toObject();
//     responseObject.id = responseObject.templateId; // Create the 'id' field
//     delete responseObject.templateId; // Clean up the old field
//     delete responseObject._id; // Clean up MongoDB's internal ID
//     delete responseObject.__v; // Clean up MongoDB's version key

//     res.status(200).json(responseObject);

//   } catch (error) {
//     console.error(`Error fetching template by ID: ${req.params.id}`, error);
//     res.status(500).json({ success: false, message: 'Failed to fetch template.', error: error.message });
//   }
// };
// module.exports = {
//   syncTemplates,
//   createTemplate,
//   updateTemplate,
//   getAllTemplates,
//   getTemplateById
// };

const axios = require('axios');
const Template = require('../model/templateSecondModal');

/**
 * @desc    Fetches all templates from the database.
 * @route   GET /api/templates
 * @access  Public
 */
const getAllTemplates = async (req, res) => {
  try {
    // Find all templates without selecting specific fields. This fetches the full documents.
    const templates = await Template.find({});
    
    // The frontend expects the main ID to be 'id'. We will map over the results
    // to transform the MongoDB documents into plain JavaScript objects that match the frontend's needs.
    const formattedTemplates = templates.map(t => {
      const templateObject = t.toObject();
      templateObject.id = templateObject.templateId;
      delete templateObject._id;
      delete templateObject.templateId;
      delete templateObject.__v;
      return templateObject;
    });

    res.status(200).json(formattedTemplates);
  } catch (error) {
    console.error('Error fetching all templates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch templates.', error: error.message });
  }
};

/**
 * @desc    Fetches a single template by its ID.
 * @route   GET /api/templates/:id
 * @access  Public
 */
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findOne({ templateId: req.params.id });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    const responseObject = template.toObject();
    responseObject.id = responseObject.templateId;
    delete responseObject._id;
    delete responseObject.templateId;
    delete responseObject.__v;
    res.status(200).json(responseObject);
  } catch (error) {
    console.error(`Error fetching template by ID: ${req.params.id}`, error);
    res.status(500).json({ success: false, message: 'Failed to fetch template.', error: error.message });
  }
};

/**
 * @desc    Creates a new template document in the database.
 * @route   POST /api/templates
 * @access  Public
 */
const createTemplate = async (req, res) => {
  try {
    const newTemplateData = req.body;
    if (!newTemplateData.id || !newTemplateData.title) {
        return res.status(400).json({ success: false, message: 'Template ID and title are required.' });
    }
    const templateToSave = new Template({
        templateId: newTemplateData.id,
        title: newTemplateData.title,
        pages: newTemplateData.pages,
        globalStyles: newTemplateData.globalStyles,
        lastModified: newTemplateData.lastModified,
    });
    const savedTemplate = await templateToSave.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'A template with this ID already exists.' });
    }
    res.status(500).json({ success: false, message: 'Failed to create template.', error: error.message });
  }
};

/**
 * @desc    Updates an existing template in the database.
 * @route   PUT /api/templates/:id
 * @access  Public
 */
const updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const templateUpdates = req.body;
    const updatedTemplate = await Template.findOneAndUpdate(
        { templateId: templateId },
        templateUpdates,
        { new: true, runValidators: true }
    );
    if (!updatedTemplate) {
        return res.status(404).json({ success: false, message: 'Template not found for update.' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ success: false, message: 'Failed to update template.', error: error.message });
  }
};

/**
 * @desc    Fetches templates from the external JSON server and syncs them.
 * @route   POST /api/templates/sync
 * @access  Public
 */
const syncTemplates = async (req, res) => {
  try {
    const templateUrl = 'https://json-server.nicor.ai/templates/tib_form_templates';
    const response = await axios.get(templateUrl);
    const externalTemplates = response.data;
    if (!Array.isArray(externalTemplates)) {
      throw new Error('Fetched data is not an array of templates.');
    }
    let successCount = 0;
    const operations = externalTemplates.map(async (template) => {
      const filter = { templateId: template.id };
      const update = {
        title: template.title,
        lastModified: template.lastModified,
        pages: template.pages,
        globalStyles: template.globalStyles,
      };
      await Template.findOneAndUpdate(filter, update, { new: true, upsert: true });
      successCount++;
    });
    await Promise.all(operations);
    res.status(200).json({
      success: true,
      message: `Successfully synced ${successCount} templates with the database.`,
    });
  } catch (error) {
    console.error('Error during template synchronization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to synchronize templates.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  syncTemplates,
  createTemplate,
  updateTemplate,
};