const mongoose = require("mongoose");
const moment = require("moment");

const blackListCommandsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  blackListAt: {
    type: String,
    default: () => moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
});

const BLackList = mongoose.model("blacklist", blackListCommandsSchema);

module.exports = BLackList;
