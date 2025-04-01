const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register a new user
router.post("/register", async (req, res) => {
  // username, email, and password from the request body
  try {
    const { username, email, password } = req.body;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email format is invalid" });
    }

    // Validate other required fields if needed
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check for duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Check for duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "An account with this email already exists" });
    }

    // hashes password using bcryptjs then save in mongo DB.
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: "User created, Sign in Your Account Now" });
  } catch (err) {
    // If error occurs, send error message
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// Log In Existing User and return a JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ email });
  // Validate password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      error:
        "Hmm, we couldn’t find a match. Please double-check your email and password.",
    });
  }
  // Create JWT token with the user's ID and jwt secret
  // Token expiration time is set to 1 hour
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  // Send token to client
  res.json({ token });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    // require both email and password provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Please enter both your email and a new password." });
    }

    // check if user exists
    const user = await User.findOne({ email });
    // if user not found, return error message
    if (!user) {
      return res
        .status(404)
        .json({ error: "That email doesn’t seem to be registered with us." });
    }
    // hash and update the password
    const newhashed = await bcrypt.hash(newPassword, 10);
    user.password = newhashed;
    await user.save();
    // send success message
    res.json({
      message:
        "Your password has been reset. You can now log in with your new one.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Server error during password reset." });
  }
});

// router.put("/update", auth, async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user by their authenticated ID
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Update username if provided
//     if (username) {
//       const existing = await User.findOne({ username });
//       if (existing && existing._id.toString() !== req.user.id) {
//         return res.status(400).json({ error: "Username already taken" });
//       }
//       user.username = username;
//     }

//     // Update password if provided
//     if (password) {
//       const hashed = await bcrypt.hash(password, 10);
//       user.password = hashed;
//     }

//     await user.save();

//     res.json({ message: "User updated successfully" });
//   } catch (err) {
//     console.error("Update Error:", err);
//     res.status(500).json({ error: "Server error during update" });
//   }
// });

module.exports = router;
