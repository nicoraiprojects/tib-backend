const mongoose = require('mongoose');

const activeJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    originalTemplateId: {
      type: String,
      required: true,
    },
    templateData: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

const ActiveJobModel = mongoose.model('ActiveJob', activeJobSchema);

module.exports = ActiveJobModel;