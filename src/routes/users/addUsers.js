//imports
import { Router } from "express";
import { body, validationResult } from "express-validator";
import userSchema from "../../schemas/userSchema.js";
import { hashing } from "./hash.js";
import {tryCatch} from "../../utilities/tryAndCatch.js";
import AppError from "../../utilities/classError.js";
//assign
const router = Router();

// the validation
const registValidation = [
  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required.")
    .bail()
    .isString()
    .withMessage("Username must be a string.")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long."),

  // password
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required.")
    .bail()
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  // email
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email format.")
    .bail()
    .normalizeEmail(),
];
router.post("/api/register", registValidation,tryCatch(async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(", ");
      return next(new AppError(400,message,true,req.path,req.method))
    }
      // return res.status(400).json({ success: false, data: errors.array() });
  
    let { body } = req;
    body.password = await hashing(body.password);
    const newUser = new userSchema(body);
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: newUser });
}) );

export default router;
