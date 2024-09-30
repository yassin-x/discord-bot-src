const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  startWith: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
    unique: true,
  },
  response: {
    type: String,
    required: true,
    unique: true,
  },
});

const Reply = mongoose.model("reply", replySchema);

module.exports = Reply;
