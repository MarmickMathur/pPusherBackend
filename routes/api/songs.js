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

router.get("/add", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  const data = req.body;
  console.log(data);
  try {
    const profile = await Profile.findOne({ user: uid });
    if (!profile) {
      return res.status(400).json({ msg: "no profile" });
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

router.get("/like/:id", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  const objid = new ObjectId(req.params);
  try {
    const profile = Profile.findOne({ user: uid }).populate();

    if (!profile) {
      return res.status(400).json({ msg: "no profile" });
    }
    const chk = await Profile.findOne({
      user: uid,
      liked: objid,
    });
    console.log(chk);
    if (chk) {
      return res.json({ msg: "already liked" });
    }

    const song = await Song.findByIdAndUpdate(
      objid,
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

router.get("/", (req, res) => res.send("songs route"));

module.exports = router;
