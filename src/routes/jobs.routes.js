const express = require("express");
const { createJob,getJobsByOrderId, getJobById } = require("../controllers/jobsController");



const router = express.Router();

router.post("/", createJob);
router.get("/by-order/:orderId", getJobsByOrderId);
router.get("/:id", getJobById);

module.exports = router;