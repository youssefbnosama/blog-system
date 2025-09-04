import { json, Router } from "express";
import userSchema from "../../schemas/userSchema.js";
import { hashing } from "./hash.js";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
const router = Router();

//edit user

router.put(
  "/api/users/:id/edit",
  tryCatch(async (req, res, next) => {
    const {
      user, // logged user
      body,
      params: { id },
    } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser)
      return next(
        new AppError(404, "There is no user", true, req.path, req.method)
      );
    // return res
    //   .status(404)
    //   .json({ success: false, error: "There is no user" });
    if (paramsUser.id !== user.id)
      return next(
        new AppError(401, "Password doesn't match", true, req.path, req.method)
      );
    // return res
    // .status(401)
    // .json({ success: false, error: "Your are not this user..." });
    body.password = await hashing(body.password);
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true }
    );
    res.status(200).json({ success: true, newData: updatedUser });
  })
);

//delete user

router.delete("/api/users/:id/delete",tryCatch(async (req, res,next) => {
    const {
      user, // logged user
      params: { id },
    } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser) return next(new AppError(404,"There is no user",true,req.path,req.method))
      // return res
      //   .status(404)
      //   .json({ success: false, error: "There is no user" });
    if (paramsUser.id !== user.id) return next(new AppError(404,"Password doesn't match",true,req.path,req.method))
      // return res
      //   .status(401)
      //   .json({ success: false, error: "Your are not this user..." });
    const updatedUser = await userSchema.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: "Deleted!" });
}) );
export default router;
