const mongoose = require("mongoose");

/**
 * User Schema
 * Represents a registered user in the system. Each user has a unique 
 * username and email, and a required password. Email is validated for format.
 *
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // Hashed password used for authentication.
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      // Regex to validate email format
      /^\S+@\S+\.\S+$/,
      "Please enter a valid email address",
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
