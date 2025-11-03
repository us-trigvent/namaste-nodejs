const express = require("express");
const connectDB = require("./config/database");
const app = express();
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("hello from 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });