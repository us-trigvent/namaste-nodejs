const User = require("../models/user");

const jwt = require("jsonwebtoken");
const adminAuth = (req, res, next) => {
  const token = "abc";
  const result = token === "abc";
  if (result) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedMessage = await jwt.verify(token, "UMESHSECRETKEY");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user=user;
    next();
  } catch (err) {
    res.status(400).send(err?.message)
    console.log(err);
  }
};
module.exports = { adminAuth, userAuth };
