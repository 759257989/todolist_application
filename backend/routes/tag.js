const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");

// // Create tag
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name, userId: req.user.id });
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user.id });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete tag
router.delete("/:id", async (req, res) => {
  try {
    const tag = await Tag.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
