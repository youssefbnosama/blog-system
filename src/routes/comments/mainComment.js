import { Router } from "express";
import addComment from "./addComment.js";

const router = Router();
router.use(addComment);
export default router;
