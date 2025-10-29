const express = require("express");
// const {adminAuth,userAuth} = require("./middleware/auth");
const connectDB = require("./config/database");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
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
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.post("/user/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send("Email and password are required");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return res.status(400).send("Invalid login credentials");
    }
    const token = await jwt.sign({ _id: user?._id }, "UMESHSECRETKEY");
    res.cookie("token", token);
    res.send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
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
    if (!userId) {
      throw new Error("UserId is required");
    }
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
    if (updatedData.skills?.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }
    await User.findByIdAndUpdate(userId, updatedData, { runValidators: true });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decodedMessage = jwt.verify(token, "UMESHSECRETKEY");
    const { _id } = decodedMessage;
    console.log(decodedMessage);
    const user = await User.findById(_id);
    res.json(user);
  } catch (err) {
    res.status(400).send("Error fetching user profile");
  }
});
