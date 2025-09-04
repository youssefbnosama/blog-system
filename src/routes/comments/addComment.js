import { Router } from "express";
import postSchema from "../../schemas/postSchema.js";
import commentSchema from "../../schemas/commentSchema.js";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
const router = Router();

// async function  userMatch(req, res, next) {
//   try {
//     if (!req.user)
//       return res.status(403).json({ success: false, error: "Unauthorized!" });
//     next();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// }
const userMatch = tryCatch(async(req,res,next)=>{
   if (!req.user) return next(new AppError(403,"User doesn't match",true,req.path,req.method));
   next()
})
// async function postExists(req, res, next) {
//   try {
//     const {
//       params: { postid },
//     } = req;
//     const post = await postSchema.findById(postid);
//     if (!postid)
//       return res
//         .status(404)
//         .json({ success: false, error: "There is no post!" });
//     req.user.post = post;
//     next();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };
const postExists = tryCatch(async(req,res,next)=>{
  const {
      params: { postid },
    } = req;
    const post = await postSchema.findById(postid);
    if (!postid) return next(new AppError(404,"There is no post",true,req.path,req.method))
    req.user.post = post;
    next();
})
router.post(
  "/api/users/posts/:postid/addcomment",
  userMatch,
  postExists,
 tryCatch(async (req, res) => {
      const newComment = new commentSchema({
        ...req.body,
        currentUserId: req.user.id,
        postId: req.user.post.id,
      });
      const savedComment = newComment.save();
      res.status(201).json({success:true,data:newComment})
  })  
);

export default router;

//http://localhost:3000/api/users/posts/68b4c9b19732436606472798/addcomment
