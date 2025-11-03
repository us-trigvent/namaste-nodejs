const express = require("express");

const bcrypt = require("bcrypt")
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (err) {
        res.status(400).send("Error fetching user profile");
    }
});
profileRouter.delete("/delete-user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Error deleting user");
    }
});
profileRouter.patch("/update-user", async (req, res) => {
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
profileRouter.patch("/update-password",userAuth, async (req, res) => {
    try {
        const { _id,currentPassword, newPassword } = req.body;

        if ( !currentPassword || !newPassword) {
            return res.status(400).send("Missing required fields");
        }
      const user = await User.findById(_id); // or from token
        if (!user) {
            throw new Error("Invalid User");
        }
        const isMatch = await user.validatePassword(currentPassword);

        if (!isMatch) {
           res.status(400).send("Current password is wrong")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await User.findByIdAndUpdate(_id, { password: hashedPassword }, { runValidators: true });
        return res.status(200).send("Password updated successfully");
    } catch (error) {
        console.error("Password update error:", error);
    return res.status(500).send("Internal server error");
    }
})

module.exports = profileRouter;