import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // بيربط البوست بيوزر
      ref: "User", // اسم الـ model بتاع اليوزر
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    commentsArray: {
      type: [String], // ممكن تخليها array من objects لو عايز تفاصيل أكتر
      default: [],
    },
    likesArray: {
      type: [String], // ممكن تخليها array من objects لو عايز تفاصيل أكتر
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // ده بيضيف createdAt و updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
