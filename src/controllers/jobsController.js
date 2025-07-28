const ActiveJobModel = require('../model/activeJobModel');
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


const duplicateJob = async (req, res) => {
    const { jobId: originalJobId } = req.params;

    try {
        const originalJob = await Job.findOne({ jobId: originalJobId }).lean();
        if (!originalJob) {
            return res.status(404).json({ success: false, message: 'Original job not found.' });
        }

        const originalActiveJob = await ActiveJobModel.findOne({ jobId: originalJobId }).lean();

        const newJobId = `JOB-${Date.now().toString().slice(-5)}`;

        const newJob = new Job({
            ...originalJob,
            _id: undefined, 
            jobId: newJobId,
            status: 'Scheduled',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        if (originalActiveJob) {
            const newActiveJob = new ActiveJobModel({
                ...originalActiveJob,
                _id: undefined,
                jobId: newJobId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await newActiveJob.save();
        }

        const savedNewJob = await newJob.save();
        res.status(201).json(savedNewJob);

    } catch (error) {
        console.error('Error duplicating job:', error);
        res.status(500).json({ success: false, message: 'Server error while duplicating job.', error: error.message });
    }
};

const deleteJob = async (req, res) => {
   const { jobId } = req.params;

    try {
        const jobToDelete = await Job.findOne({ jobId: jobId });
        if (!jobToDelete) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        await Job.deleteOne({ jobId: jobId });
        await ActiveJobModel.deleteOne({ jobId: jobId });

        res.status(200).json({ 
            success: true, 
            message: `Job ${jobId} and associated data deleted successfully.` 
        });

    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting job.', error: error.message });
    }
};


module.exports = {
    createJob,
    getJobsByOrderId,
    getJobById,
    duplicateJob,
    deleteJob
};