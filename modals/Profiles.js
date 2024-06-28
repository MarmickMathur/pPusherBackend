const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  songs: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
  },
  liked: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
  },
  friends: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "profile" }],
  },
  favsong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "song",
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
