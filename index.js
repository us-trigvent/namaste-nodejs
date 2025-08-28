const express = require("express");
// const {adminAuth,userAuth} = require("./middleware/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
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

app.delete("/delete-user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user");
  }
});
app.patch("/update-user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const updatedData = req.body;
    const ALLOWED_UPDATES = [
      "userId",
      "photo_url",
      "gender",
      "age",
      "about",
      "skills",
      "lastName",
    ];
    const IS_UPDATES_ALLOWED = Object.keys(updatedData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!IS_UPDATES_ALLOWED) {
      throw new Error("Updates not allowed");
    }
    if (updatedData.skills.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }
    await User.findByIdAndUpdate(userId, updatedData, { runValidators: true });
    res.send("User updated successfully");
  } catch (err) {
  res.status(400).send(err.message);
}
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
