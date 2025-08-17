import mongoose from "mongoose";

const connectDB = (async () => {
  try {
    console.log("🔎 Trying to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI); // ✅ no extra options needed
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ mongoose connection error:", error.message);
    process.exit(1);
  }
});

export default connectDB;
