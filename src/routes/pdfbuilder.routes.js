const express = require("express");
const { pdf_generator } = require("../controllers/pdfController");
const router = express.Router();

// router.post("/generate-pdf/:id", pdf_generator);
router.get("/generate-pdf/:jobId", pdf_generator);


module.exports = router;
