import { Router } from "express";
import postSchema from "../../schemas/postSchema.js";
import mongoose from "mongoose";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
const router = Router();

router.get("/api/users/posts/:postId",tryCatch(async (req, res,next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!user) return next(new AppError(401,"You have to sign in",true,req.path,req.method))
      // return res
      //   .status(400)
      //   .json({ success: false, data: "You have to sign in " });
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
}));

export default router;
