import { json, Router } from "express";
import userSchema from "../../schemas/userSchema.js";
import { hashing } from "./hash.js";
import { tryCatch } from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
import { authMiddleware } from "../../utilities/tokenMiddles.js";
import { body, validationResult } from "express-validator";
const router = Router();

//update validation
const editValidation = [
  body("username")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Username must be a string.")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long."),

  body("password")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email format.")
    .bail()
    .normalizeEmail(),
];

//edit user
router.patch(
  "/api/users/me/edit",
  authMiddleware,
  editValidation,
  tryCatch(async (req, res, next) => {
    // const {
    //   user, // logged user
    //   body,
    //   params: { id },
    // } = req;
    // const paramsUser = await userSchema.findById(id);
    // if (!paramsUser)
    //   return next(
    //     new AppError(404, "There is no user", true, req.path, req.method)
    //   );
    // if (paramsUser.id !== user.id)
    //   return next(
    //     new AppError(401, "Password doesn't match", true, req.path, req.method)
    //   );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((err) => err.msg)
        .join(", ");
      return next(new AppError(400, message, true, req.path, req.method));
    }
    const { user, body } = req;
    body.password = await hashing(body.password);
    const updatedUser = await userSchema.findByIdAndUpdate(
      user.id,
      {
        ...body,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, newData: updatedUser });
  })
);

//delete user

router.delete(
  "/api/users/me/delete",
  tryCatch(async (req, res, next) => {
    // const {
    //   user, // logged user
    //   params: { id },
    // } = req;
    // const paramsUser = await userSchema.findById(id);
    // if (!paramsUser) return next(new AppError(404,"There is no user",true,req.path,req.method))
    // return res
    //   .status(404)
    //   .json({ success: false, error: "There is no user" });
    // if (paramsUser.id !== user.id) return next(new AppError(404,"Password doesn't match",true,req.path,req.method))
    // return res
    //   .status(401)
    //   .json({ success: false, error: "Your are not this user..." });
    const { user } = req;
    const deletedUser = await userSchema.findByIdAndDelete(user.id);
    res.status(200).json({ success: true, data: deletedUser });
  })
);
export default router;
