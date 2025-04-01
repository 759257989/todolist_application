const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get all tasks for a user
router.get("/", async (req, res) => {
  try {
    // find all tasks for the current user
    const tasks = await Task.find({ userId: req.user.id }).populate("tags");
    // return the tasks in json format
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  // create a new task, copy the userId, title, priority, tag from the request object
  const task = new Task({
    userId: req.user.id,
    title: req.body.title,
    priority: req.body.priority,
    tags: req.body.tags || [],
  });
  // save to database
  await task.save();
  // return the created task
  res.status(201).json(task);
});

// Update a task (title, priority, completed, tags)
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    ).populate("tags");

    // If no task was found
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a tag to a task
router.post("/:id/tags", async (req, res) => {
  const { tagId } = req.body;
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.tags.includes(tagId)) {
      task.tags.push(tagId);
      await task.save();
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove a tag from a task
router.delete("/:id/tags/:tagId", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.tags = task.tags.filter(
      (tagId) => tagId.toString() !== req.params.tagId
    );

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
