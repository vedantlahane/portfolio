const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const testRoutes = require("./routes/testRoutes");
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Portfolio API");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Vite's default port
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes testing...
app.use("/api", testRoutes);// will let to {
//                                               "message": "API is working!"
//                                          } on browser

app.use('/api', contactRoutes);