const Job = require('../model/jobsModel');

const createJob = async (req, res) => {
    try {
        const { orderId, jobId, client, status, dueDate, templateId, templateName } = req.body;

        if (!orderId || !jobId || !client || !templateId || !templateName) {
            return res.status(400).json({ success: false, message: 'Missing required job fields.' });
        }

        const newJob = new Job({
            orderId,
            jobId,
            client,
            status,
            dueDate,
            templateName,
            templateId
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);

    } catch (error) {
        console.error('Error creating job:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'A job with this ID already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error while creating job.', error: error.message });
    }
};

const getJobsByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const jobs = await Job.find({ orderId: orderId }).lean();

        if (!jobs) {
            return res.status(404).json({ message: "No jobs found for this order." });
        }
        
        const formattedJobs = jobs.map(job => ({
            id: job._id.toString(),
            jobId: job.jobId,
            orderId: job.orderId,
            type: job.templateName,
            status: job.status,
            due: job.dueDate,
            templateId: job.templateId
        }));
        
        res.status(200).json(formattedJobs);

    } catch (error) {
        console.error('Error fetching jobs by order ID:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching jobs.', error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).lean();

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        const formattedJob = {
            id: job._id.toString(),
            jobId: job.jobId,
            orderId: job.orderId,
            client: job.client,
            clientLocation: job.clientLocation || 'N/A',
            equipmentDetails: job.equipmentDetails || 'N/A',
            inspector: job.inspector,
            type: job.templateName,
            status: job.status,
            due: job.dueDate,
            templateId: job.templateId,
            interactionLogs: job.interactionLogs || [],
            rejectionReason: job.rejectionReason
        }; 
        
        res.status(200).json(formattedJob);

    } catch (error) {
        console.error('Error fetching job by ID:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching job.' });
    }
};

module.exports = {
    createJob,
    getJobsByOrderId,
    getJobById
};