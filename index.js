import express from "express";
import mongoose from "mongoose";
import mainUsers from "./src/routes/users/mainUsers.js";
import mainPosts from "./src/routes/posts/mainPost.js";
import mainComment from "./src/routes/comments/mainComment.js"
import mainLike from "./src/routes/likes/mainLike.js"
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "youssefBnOsamaIsEnough",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/blogsystem",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect("mongodb://127.0.0.1:27017/blogsystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Error connecting MongoDB:", err));

app.use(mainUsers);
app.use(mainPosts);
app.use(mainComment);
app.use(mainLike);
app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
