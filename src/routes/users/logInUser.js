import { Router } from "express";
import passport from "passport";
import {tryCatch} from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js"
import "../../passport/userPassport.js";
const router = Router();

router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(new AppError(404,info.message,true,req.path,req.method))
      //  return res.status(401).json({ error: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        success: true,
        user: { id: user._id, username: user.username },
      });
    });
  })(req, res, next);
});

export default router;
