const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported"
      }

    },
    photoUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    about: {
      type: String,
      maxLength: 500,
      default: "This user prefers to keep an air of mystery about them.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "UMESHSECRETKEY", {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = bcrypt.compare(passwordByUser, hashedPassword);
  return isPasswordValid;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
