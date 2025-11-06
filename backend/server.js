// backend/server.js
require('colors');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  CLOUDINARY: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing'
});

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - restrict in production by setting CORS_ORIGIN
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Routes
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Franchise API is running...');
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error('❌ Error:'.red, err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.cyan.bold);
});

// handle unexpected rejections/exceptions
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err?.message || err}`.red);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception! 💥 Shutting down...'.red, err);
  server.close(() => process.exit(1));
});
