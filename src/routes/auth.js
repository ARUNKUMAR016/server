const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "username & password required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ ok: false, error: "username already exists" });
    }

    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({ ok: true, msg: "registered" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      "sparta", // hardcoded since you're not using env right now
      { expiresIn: "7d" }
    );

    return res.json({ ok: true, token, user: { id: user._id, username: user.username } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

module.exports = router;
