const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const testRoutes = require("./routes/testRoutes");
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: "vedantlahane.vercel.com", // Update this to your frontend's deployed URL (e.g., https://your-frontend.vercel.app) when ready
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if connection fails
  });

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Portfolio API");
});

// Routes
app.use("/api", testRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});