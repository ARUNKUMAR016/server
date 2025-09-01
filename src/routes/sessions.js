const express = require("express");
const { auth } = require("../middleware/auth.js");
const { WorkoutSession } = require("../models/WorkoutSession.js");

const router = express.Router();

// List recent sessions (current user)
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await WorkoutSession
      .find({ user: req.user.id })
      .sort({ startedAt: -1 })
      .limit(20)
      .lean();

    // Map to your RN UI format
    const data = sessions.map((s) => ({
      id: String(s._id),
      focus: s.focus,
      date: new Date(s.startedAt).toLocaleString(),
      exercises: s.exercisesCount,
      notes: s.notes || "",
    }));

    return res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// Create a session
router.post("/", auth, async (req, res) => {
  try {
    const { focus, startedAt, exercisesCount = 0, notes = "" } = req.body || {};
    if (!focus || !startedAt) {
      return res.status(400).json({ ok: false, error: "focus & startedAt required" });
    }

    const session = await WorkoutSession.create({
      user: req.user.id,
      focus,
      startedAt: new Date(startedAt),
      exercisesCount,
      notes,
    });

    return res.status(201).json({ ok: true, data: { id: String(session._id) } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

module.exports = router;
