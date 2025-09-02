import { Router } from "express";
import passport from "passport";
import "../../passport/userPassport.js";
const router = Router();

router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });
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
