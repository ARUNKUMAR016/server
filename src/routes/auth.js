// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "sparta"; // env on Render

// Small helper: normalize input safely
function norm(v) {
  return (typeof v === "string" ? v.trim() : "");
}

// -------------------- Register --------------------
router.post("/register", async (req, res) => {
  try {
    const username = norm(req.body?.username);
    const password = norm(req.body?.password);

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "username_and_password_required" });
    }

    // Ensure username uniqueness
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ ok: false, error: "username_already_exists" });
    }

    const user = new User({ username });
    await user.setPassword(password); // assumes your model implements this
    await user.save();

    return res.status(201).json({ ok: true, msg: "registered" });
  } catch (e) {
    console.error("REGISTER_ERR:", e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// -------------------- Login --------------------
// Accepts either { username, password } OR { email, password }
// If you only store username, the email branch just won’t match—no issue.
router.post("/login", async (req, res) => {
  try {
    const username = norm(req.body?.username);
    const email = norm(req.body?.email);
    const password = norm(req.body?.password);

    if (!password || (!username && !email)) {
      return res.status(400).json({ ok: false, error: "credentials_required" });
    }

    // Prefer username when provided; else try email if your model has it
    const query = username ? { username } : { email };
    const user = await User.findOne(query);

    // Avoid revealing which part failed
    if (!user) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const valid = await user.verifyPassword(password); // assumes your model implements this
    if (!valid) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (e) {
    console.error("LOGIN_ERR:", e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

module.exports = router;
