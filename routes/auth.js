const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
authRouter.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.send("User registered successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expiresIn: new Date(Date.now()),
    })
    res.send("Logout Successful")
})
authRouter.post("/user/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("Invalid login credentials");
        }
        const isMatch = user.validatePassword(password);
        if (!isMatch) {
            return res.status(400).send("Invalid login credentials");
        }
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send({
            message: "User logged in successfully",
            user: user,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

module.exports = authRouter;