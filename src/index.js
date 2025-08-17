import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { error } from "console";

dotenv.config();

const app = express();

connectDB()
.then( () => {
  app.listen(process.env.PORT || 8000 , () => {
    console.log(`SEVER is running at port , ${process.env.PORT}`);
  })
})
.catch(() => {
  console.log("MONGODB CONNECTION FAILED" , error);
})
