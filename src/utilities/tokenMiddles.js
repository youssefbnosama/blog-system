import jwt from "jsonwebtoken";
import AppError from "./classError.js";
import { tryCatch } from "./tryAndCatch.js";
import User from "../schemas/userSchema.js";
export const authMiddleware = tryCatch(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return next(
      new AppError(401, "You have to logIn", true, req.path, req.method)
    );
    const decoded = jwt.verify(token,process.env.SECRET_JWT_KEY);
    req.user = await User.findById(decoded.id);
    next()
});
