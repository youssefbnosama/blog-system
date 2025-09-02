import { Router } from "express";
import userSchema from "../../schemas/userSchema.js";
// import postSchema from "../../schemas/postSchema.js";
import mongoose from "mongoose";
const router = Router();

router.get("/api/users/:id/posts", async (req, res) => {
  try {
    const { params:{id} } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser) return res.status(403).json({ error: "there is no user" });
    let finalData = await userSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user_id",
          as: "posts",
          pipeline: [
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "postId",
                as: "comments",
              },
            },
            {
              $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"postId",
                as:"likes",
              }
            },
            {
              $addFields:{
                likesCount:{$size:"$likes"},
                commentCount:{$size:"$comments"}
              }
            }

          ],
        },
      },
    ]);
    finalData = finalData[0];
    console.log(finalData.posts[0])
    res.status(200).json(finalData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

export default router;
