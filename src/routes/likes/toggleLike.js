import { Router } from "express";
import likeSchema from "../../schemas/likeSchema.js";
const router = Router();

router.post("/api/users/posts/:postId/togglelike", async (req, res) => {
  try {
    const {
      body,
      user,
      user: { id },
      params: { postId },
    } = req;
    if (!user)
      res.status(404).json({ success: false, error: "You must logIn" });
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
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

export default router;
