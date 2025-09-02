import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import userSchema from "../schemas/userSchema.js";
import bcrypt from "bcrypt";
passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      let user = await userSchema.findOne({ username: username });
      if (!user) return done(null, false, { message: "there is no user" });
      if (!(await bcrypt.compare(password, user.password)))
        return done(null, false, { message: "Password doesn't match" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userSchema.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
