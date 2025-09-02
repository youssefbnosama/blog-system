import { Router } from "express";
import postSchema from "../../schemas/postSchema.js";
import mongoose from "mongoose";
const router = Router();

router.get("/api/users/posts/:postId", async (req, res) => {
  try {
    const {
      user,
      params: { postId },
    } = req;
    if (!user)
      return res
        .status(400)
        .json({ success: false, data: "You have to sign in " });
    let data = await postSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
    ]);

    data = data[0];
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
