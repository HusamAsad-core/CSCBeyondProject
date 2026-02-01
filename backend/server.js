const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Imports
const promisePool = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const planRoutes = require('./src/routes/planRoutes');
const errorHandler = require('./src/utils/errorHandler');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});