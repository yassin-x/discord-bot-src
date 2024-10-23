const mongoose = require("mongoose");

const commandsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  aliases: {
    type: Array,
    required: true,
    default: [],
  },
  permission: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    required: true,
  },
});

const Command = mongoose.model("Command", commandsSchema);

module.exports = Command;
