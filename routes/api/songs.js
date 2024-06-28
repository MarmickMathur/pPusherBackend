const express = require("express");
const router = express.Router();
const Song = require("../../modals/Songs.js");
const Profile = require("../../modals/Profiles");
const { ObjectId } = require("mongodb");
const verifyToken = require("../../middleware/auth");
const { connection } = require("mongoose");

router.get("/", async (req, res) => {
  // gets  10 songs form all songs
  try {
    const songs = await Song.find().limit(10).populate("owner");
    console.log(songs);
    return res.json(songs);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
  res.send("songs route");
});

router.post("/add", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  const data = req.body;
  console.log(data);
  try {
    const profile = await Profile.findOne({ user: uid });
    if (!profile) {
      return res.status(400).json({ msg: "no profile" });
    }
    const chk = await Song.findOne({ name: data.name });
    if (chk) {
      return res.json({ msg: "name already exist" });
    }

    const song = new Song({
      name: data.name,
      owner: profile,
    });
    await Profile.findOneAndUpdate(
      { user: uid },
      { $push: { songs: song } },
      { new: true }
    );
    await song.save();
    return res.json({ msg: "successfully added song" });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

router.post("/like/:name", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  try {
    const profile = await Profile.findOne({ user: uid });
    const foundsong = await Song.findOne({ name: req.params.name });
    if (!profile) {
      return res.status(400).json({ msg: "no profile" });
    }
    if (!foundsong) {
      return res.json({ msg: "no such song" });
    }

    const chk = await Profile.findOne({
      user: uid,
      liked: foundsong,
    });

    console.log(chk);
    if (chk) {
      console.log("inhere disliking now");
      const foundsong = await Song.findOneAndUpdate(
        { name: req.params.name },
        { $inc: { likes: -1 } },
        { new: true }
      );
      console.log(foundsong);
      const songId = foundsong._id;
      await Profile.findOneAndUpdate(
        { user: uid },
        { $pull: { liked: songId } },
        { new: true }
      );
      return res.json({ msg: "seccussfully disliked" });
    }

    const song = await Song.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { likes: 1 } },
      { new: true }
    );
    console.log(song);
    await Profile.findOneAndUpdate(
      { user: uid },
      { $push: { liked: song } },
      { new: true }
    );
    return res.json({ msg: "liked successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

router.get("/fetch/:name", verifyToken, async (req, res) => {
  console.log(req.params.name);
  //   res.send(req.params.name);
  try {
    const foundsong = await Song.findOne({ name: req.params.name }).populate(
      "owner"
    );
    console.log(foundsong);
    if (!foundsong) {
      return res.json({ msg: "no such song" });
    }
    console.log(foundsong);
    return res.json(foundsong);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// router.get("/", (req, res) => res.send("songs route"));

module.exports = router;
