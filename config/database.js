const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://umesh:Sumit123@umesh-cluster.sdppjkc.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
