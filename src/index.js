// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dbConnect = require("./db.js");
const authRoutes = require("./routes/auth.js");
const sessionRoutes = require("./routes/sessions.js");

// ✅ Use environment variables (set in Render dashboard)
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // safe default for local

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check (Render will use this if you set it in settings or render.yaml)
app.get("/", (_req, res) => res.json({ ok: true, msg: "Spartan API ✅" }));

// Routes
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);

// Start server after DB connects
dbConnect(MONGO_URI).then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API running on port ${PORT}`);
  });
});
