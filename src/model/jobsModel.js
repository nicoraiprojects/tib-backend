const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    orderId: { 
        type: String, 
        required: true 
    },
    client: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'Scheduled' 
    },
    dueDate: { 
        type: Date 
    },
     templateName: {
        type: String,
        required: true
    },
    templateId: {
        type: String,
        required: true
    },
     clientLocation: { type: String },
    equipmentDetails: { type: String },
    inspector: { type: String, default: 'Unassigned' },
    interactionLogs: { type: Array, default: [] },
    rejectionReason: { type: String }

}, {
    timestamps: true 
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;