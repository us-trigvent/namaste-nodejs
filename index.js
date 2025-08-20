const express = require("express");
const {adminAuth,userAuth} = require("./middleware/auth");
const app = express();

app.listen(3000, () => {
  console.log("hello from 3000");
});

app.use("/admin", adminAuth);
app.get("/admin/getUser", (req, res) => {
    res.status(200).send("Authorized frm 1");
});
app.get("/admin/getUser2", (req, res) => {
  res.status(200).send("Authorized 2");
});
app.get("/user/register", (req, res) => {
  res.status(200).send("Authorized 2");
});

app.get("/user/login", userAuth, (req, res) => {
  res.status(200).send("User login successful");
});
