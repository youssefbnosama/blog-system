import { Router } from "express";
import postSchema from "../../schemas/postSchema.js";
import userSchema from "../../schemas/userSchema.js";

const router = Router();

router.post("/api/users/:id/addpost", async (req, res) => {
  try {
    const {
      body,
      params: { id },
    } = req;
    const newPost = new postSchema({ ...body, user_id: id });
    const savedPost = newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
});

export default router;
