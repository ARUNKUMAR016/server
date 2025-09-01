const mongoose = require("mongoose");

const workoutSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    focus: { type: String, required: true },           // e.g., Chest, Back, Legs
    startedAt: { type: Date, required: true },         // start time
    exercisesCount: { type: Number, default: 0 },      // e.g., 5
    notes: { type: String },
  },
  { timestamps: true }
);

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);

module.exports = { WorkoutSession };
