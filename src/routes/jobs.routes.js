const express = require("express");
const { createJob,getJobsByOrderId, getJobById, duplicateJob, deleteJob } = require("../controllers/jobsController");



const router = express.Router();

router.post("/", createJob);
router.get("/by-order/:orderId", getJobsByOrderId);
router.get("/:id", getJobById);
router.post('/duplicate/:jobId', duplicateJob);
router.delete('/:jobId', deleteJob);

module.exports = router;