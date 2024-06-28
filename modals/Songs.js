const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Song = mongoose.model("song", SongSchema);
