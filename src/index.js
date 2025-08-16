import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

// ✅ Debug: check env values
console.log("ENV PORT:", process.env.PORT);
console.log("ENV MONGODB_URI:", process.env.MONGODB_URI);

const app = express();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

