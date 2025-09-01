const mongoose = require("mongoose");

const MONGO_URI = `mongodb+srv://arunkumarveerapandian4_db_user:fxEPXtjI9wLq44MR@fit.j2oj81u.mongodb.net/?retryWrites=true&w=majority&appName=fit`;

const dbConnect = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB connection URI is not defined.");
    }

    mongoose.set("strictQuery", true); // optional: silence deprecation warnings
    mongoose.set("debug", true);       // optional: enable query debug logs

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

module.exports = dbConnect;
