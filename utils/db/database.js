const { MongoUrI } = require("../../config.json");

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(MongoUrI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
