import { json, Router } from "express";
import userSchema from "../../schemas/userSchema.js";
import { hashing } from "./hash.js";
const router = Router();

//edit user

router.put("/api/users/:id/edit", async (req, res) => {
  try {
    const {
      user, // logged user
      body,
      params: { id },
    } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser)
      return res
        .status(404)
        .json({ success: false, error: "There is no user" });
    if (paramsUser.id !== user.id)
      return res
        .status(403)
        .json({ success: false, error: "Your are not this user..." });
    body.password = await hashing(body.password);
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true }
    );
    res.status(200).json({ success: true, newData: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

//delete user

router.delete("/api/users/:id/delete", async (req, res) => {
  try {
    const {
      user, // logged user
      params: { id },
    } = req;
    const paramsUser = await userSchema.findById(id);
    if (!paramsUser)
      return res
        .status(404)
        .json({ success: false, error: "There is no user" });
    if (paramsUser.id !== user.id)
      return res
        .status(403)
        .json({ success: false, error: "Your are not this user..." });
    const updatedUser = await userSchema.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: "Deleted!" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
export default router;
