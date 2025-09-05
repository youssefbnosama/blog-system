import { Router } from "express";
import userSchema from "../../schemas/userSchema.js";
import mongoose from "mongoose";
import {tryCatch} from "../../utilities/tryAndCatch.js";
import  AppError from "../../utilities/classError.js";
const router = Router();

router.get("/api/users/:id/posts",tryCatch(async (req, res,next) => {
    const { params:{id} } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser) return next(new AppError(404,"There is no user",true,req.path,req.method))
      //  return res.status(404).json({ error: "there is no user" });
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
    res.status(200).json(finalData);
}) );

export default router;
