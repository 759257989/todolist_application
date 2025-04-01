const mongoose = require("mongoose");

/**
 * Tag Schema
 * Represents a user-defined tag that can be applied to tasks.
 * links the tag to the user who created it.
 */
const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // foreign key that connects this tag to a user.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index to ensure that each user can only have one tag with a given name.
// This prevents duplicate tags for the same user.
TagSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Tag", TagSchema);
