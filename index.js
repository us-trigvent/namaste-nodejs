const express = require("express");
// const {adminAuth,userAuth} = require("./middleware/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.post("/register", async (req, res) => {
  const newUser = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@gmail.com",
    password: "password123",
    age: 33,
  });
  await newUser.save();
  res.send("User registered successfully");
});
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
