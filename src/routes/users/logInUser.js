import { Router } from "express";
// import passport from "passport";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
// import "../../passport/userPassport.js";
import userSchema from "../../schemas/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();

// logIn passport
// router.post("/api/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) return next(new AppError(404,info.message,true,req.path,req.method))
//       //  return res.status(401).json({ error: info.message });
//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       return res.status(200).json({
//         success: true,
//         user: { id: user._id, username: user.username },
//       });
//     });
//   })(req, res, next);
// });

router.post(
  "/api/login",
  tryCatch(async (req, res, next) => {
    const { username,  password } = req.body;
    let user = await userSchema.findOne({ username: username });
    if (!user)
      return next(
        new AppError(404, "User not found", true, req.path, req.method)
      );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_SECRET_JWT_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully" });
  })
);
router.get("/api/refreshToken", async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send("Not found");  
  try {
    const decoded = jwt.decode(
      refreshToken,
      process.env.REFRESH_SECRET_JWT_KEY
    );
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Access token refreshed" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
export default router;
