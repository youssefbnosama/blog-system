import { Router } from "express";
import userSchema from "../../schemas/userSchema.js";
import postSchema from "../../schemas/postSchema.js";
import commentSchema from "../../schemas/commentSchema.js";
const router = Router();

async function userMatch(req, res, next) {
  try {
    if (!req.user)
      return res.status(403).json({ success: false, error: "Unauthorized!" });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
async function postExists(req, res, next) {
  try {
    const {
      params: { postid },
    } = req;
    const post = await postSchema.findById(postid);
    if (!postid)
      return res
        .status(404)
        .json({ success: false, error: "There is no post!" });
    req.user.post = post;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
router.post(
  "/api/users/posts/:postid/addcomment",
  userMatch,
  postExists,
  async (req, res) => {
    try {
      const newComment = new commentSchema({
        ...req.body,
        currentUserId: req.user.id,
        postId: req.user.post.id,
      });
      const savedComment = newComment.save();
      res.status(201).json({success:true,data:newComment})
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;

//http://localhost:3000/api/users/posts/68b4c9b19732436606472798/addcomment
