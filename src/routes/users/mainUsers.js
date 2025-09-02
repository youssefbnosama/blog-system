import { Router } from "express";
import addUsers from "./addUsers.js";
import logInUser from "./logInUser.js";
import crudUser from "./CRUDUser.js";
import showUserInfo from "./showUserPosts.js"
const router = Router();

router.use(addUsers);
router.use(logInUser);
router.use(crudUser);
router.use(showUserInfo);
export default router;
