import { Router } from "express";
import postSchema from "../../schemas/postSchema.js";
import {tryCatch} from "../../utilities/tryAndCatch.js"
import { body,validationResult } from "express-validator";
import AppError from "../../utilities/classError.js";
import {authMiddleware} from "../../utilities/tokenMiddles.js"
const router = Router();
 const myValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required and cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),

  body("body")
    .notEmpty()
    .withMessage("body is required and cannot be empty"),
];
router.post("/api/users/me/addpost",authMiddleware, myValidator,tryCatch( async (req, res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const message = errors.array().map(err => err.msg).join(", ");
    return next(new AppError(400,message,true,req.path,req.method))
  } 
    const {
      user,
      body
    } = req;
    const newPost = new postSchema({ ...body, user_id: user.id });
    const savedPost = newPost.save();
    res.status(201).json({ success: true, data: newPost });
}));

export default router;
