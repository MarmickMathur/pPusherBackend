const express = require("express");
const router = express.Router();
const Profile = require("../../modals/Profiles");
const verifyToken = require("../../middleware/auth");

router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const profile = await Profile.findOne({ user: req.user.uid })
      .populate({
        path: "friends",
      })
      .populate("songs")
      .populate("liked")
      .populate("favsong");
    if (!profile) {
      return res.status(400).json({ msg: "no profile" });
    }
    console.log(profile);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post("/add", verifyToken, async (req, res) => {
  console.log(req.user);
  try {
    console.log("got");
    let profile = await Profile.findOne({ user: req.user.uid });
    if (profile) {
      return res.json({ msg: "profile already exists" });
    }
    profile = new Profile({
      user: req.user.uid,
      name: req.user.name,
    });
    await profile.save();
    return res.json({ msg: "user created" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/view/:id", verifyToken, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.id });
    if (!profile) {
      return res.status(400).json({ msg: "noprofile" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
