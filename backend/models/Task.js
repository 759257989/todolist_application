const mongoose = require("mongoose");

/**
 * Task Schema
 * Represents a task belonging to a user. Each task includes a title,
 * priority level, completion status, and timestamps for creation and updates.
 */
const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
//   include create and update time
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
