const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
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
