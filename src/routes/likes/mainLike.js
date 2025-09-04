import { Router } from "express";
import addLike from "./toggleLike.js";

const router = Router();

router.use(addLike);

export default router;
