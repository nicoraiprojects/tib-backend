const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    // We use the ID from the JSON as our own unique identifier.
    templateId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
    },

    pages: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    globalStyles: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

const TemplateModel = mongoose.model('Template', templateSchema);

module.exports = TemplateModel;