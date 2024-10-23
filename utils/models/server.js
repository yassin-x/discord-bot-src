const mongoose = require("mongoose");
const moment = require("moment");

const serverSchema = new mongoose.Schema({
  guid: {
    type: Number,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    default: "y!",
  },
  joinedAt: {
    type: String,
    default: () => moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
});

const Server = mongoose.model("Server", serverSchema);

module.exports = Server;
