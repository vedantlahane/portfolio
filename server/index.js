// Import required dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import route handlers
const testRoutes = require("./routes/testRoutes");
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Initialize express application
const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * CORS Configuration
 * Configures Cross-Origin Resource Sharing for the API
 * Specifies which domains can access the API
 */
const corsOptions = {
  origin: [
    "http://localhost:5173",    // Local development
    "http://127.0.0.1:5173",    // Alternative localhost
    "https://vedantlahane.vercel.app"  // Production domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());  // Parse JSON bodies

/**
 * Database Connection
 * Establishes connection to MongoDB using mongoose
 * Exits process if connection fails
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

/**
 * Route Definitions
 * Define all API endpoints and their corresponding route handlers
 */

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Portfolio API",
    timestamp: new Date()
  });
});

// API Routes
app.use("/api/test", testRoutes);          // Test endpoints
app.use('/api/blogs', blogRoutes);    // Blog-related endpoints
app.use('/api/contact', contactRoutes); // Contact form endpoints

/**
 * Error Handling Middleware
 * Catches any errors that weren't handled in the routes
 */
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

/**
 * Server Initialization
 * Starts the server on specified port
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;