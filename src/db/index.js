import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
    try {
        const conncetioninstance = await mongoose.connect
        (`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB_HOST:${conncetioninstance.connection.host}`);
    } catch (error) {
        console.log("mongoose connection error",error);
        process.exit(1)
    }
}

export default connectDB;