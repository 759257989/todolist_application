// Required Libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// routes and middleware
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const authMiddleware = require("./middleware/auth");
const tagRoutes = require("./routes/tag");
console.log(typeof authMiddleware);

const app = express();
// cross-origin communication
app.use(cors());
// parse incoming requests with JSON payloads
app.use(express.json());

// mount routes
app.use("/api", authRoutes);
// JWT required to access this route
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/tags", authMiddleware, tagRoutes);

// connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));

module.exports = app;
