require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// Database Connection
connectDB();

const app = express();
const path = require('path');

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for Vercel deployment
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Express Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export the Express API for Vercel Serverless Functions
module.exports = app;
