// models/reaction.js
import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["like", "love", "sad", "angry"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model("likes", reactionSchema);
