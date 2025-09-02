import { Router } from "express";
import addPost from "./addPost.js";
import showPost from "./showPost.js"
const router = Router();

router.use(addPost);
router.use(showPost)
export default router;
