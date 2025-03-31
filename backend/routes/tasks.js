const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get all tasks for a user
router.get("/", async (req, res) => {
  try {
    // find all tasks for the current user
    const tasks = await Task.find({ userId: req.user.id });
    // return the tasks in json format
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  // create a new task, copy the userId, title, priority from the request object
  const task = new Task({
    userId: req.user.id,
    title: req.body.title,
    priority: req.body.priority,
  });
  // save to database
  await task.save();
  // return the created task
  res.status(201).json(task);
});

// Update a task
router.put("/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    // filter by task id param and user id from jwt token
    { _id: req.params.id, userId: req.user.id },
    req.body,
    // return the updated task object
    { new: true }
  );
  res.json(task);
});

// Delete a task
router.delete("/:id", async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
});

module.exports = router;
