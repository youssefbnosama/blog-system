import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // بيربط البوست بيوزر
      ref: "User", // اسم الـ model بتاع اليوزر
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // ده بيضيف createdAt و updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
