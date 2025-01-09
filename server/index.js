const express = require("express");
const mongoose = require("mongoose");
// const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const testRoutes = require("./routes/testRoutes");
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// const uri = process.env.MONGODB_URI;

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });


// // Create a MongoClient
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
  
//   async function run() {
//     try {
//       await client.connect();
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
      
//       // Your additional server logic here
  
//     } catch (error) {
//       console.error("Connection error:", error);
//     } finally {
//       // Optionally keep the connection open for your app's lifecycle
//       // await client.close();
//     }
//   }
  
//   run().catch(console.dir);

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

app.use('/api', blogRoutes);
app.use('/api', contactRoutes);

