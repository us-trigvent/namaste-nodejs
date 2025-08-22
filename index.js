const express = require("express");
// const {adminAuth,userAuth} = require("./middleware/auth");
const connectDB = require("./config/database");
const app = express();

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

// app.use("/admin", adminAuth);
// app.get("/admin/getUser", (req, res) => {
//     res.status(200).send("Authorized frm 1");
// });
// app.get("/admin/getUser2", (req, res) => {
//   res.status(200).send("Authorized 2");
// });
// app.get("/user/register", (req, res) => {
//   res.status(200).send("Authorized 2");
// });

// app.get("/user/login", userAuth, (req, res) => {
//   res.status(200).send("User login successful");
// });
