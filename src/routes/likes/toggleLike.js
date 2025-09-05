import { Router } from "express";
import likeSchema from "../../schemas/likeSchema.js";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
import {authMiddleware} from "../../utilities/tokenMiddles.js"
const router = Router();

router.post("/api/posts/:postId/togglelike",authMiddleware,tryCatch(async (req, res,next) => {
    const {
      body,
      user: { id },
    } = req;
    // if (!user) return next(new AppError(401,"You have to sign in",true,req.path,req.method))
      // res.status(404).json({ success: false, error: "You must logIn" });
    let theLike = await likeSchema.findOne({ postId: postId, userId: id });
    if (!theLike) {
      let newLike = new likeSchema({ ...body, postId: postId, userId: id });
      let savedLike =await newLike.save();
     return res.status(201).json({ success: true, data: newLike });
    } else if (theLike.type !== body.type) {
      let updatedLike = await likeSchema.findOneAndUpdate({ $and:[{ postId: postId},{userId: id}] },{...body},{new:true});
    return  res.status(201).json({ success: true, data: updatedLike });
    } else {
      await likeSchema.deleteOne({ postId: postId, userId: id });
    return  res.status(200).json({ success: true });
    }
}));

export default router;
