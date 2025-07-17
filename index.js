const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pdfBuilder = require('./src/routes/pdfbuilder.routes'); // <-- IMPORT the PDF routes
const templateRoutes = require('./src/routes/template.routes'); // <-- IMPORT the PDF routes
const connectDB = require('./src/config/db');
dotenv.config();

connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// Serve static CSS files
app.use('/styles', express.static(path.join(__dirname, 'styles')));
// Serve static HTML templates
app.use('/templates', express.static(path.join(__dirname, 'templates')));
// Serve static image assets
app.use('/assets/images', express.static(path.join(__dirname, 'assets', 'images')));

app.use('/api', pdfBuilder);
app.use('/api/templates', templateRoutes); // <-- Use the template routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});