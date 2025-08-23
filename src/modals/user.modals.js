const { Schema } = require("mongoose");

import mongoose , {Schema} from "mongoose";

const user_schema = new Schema({
    
})

export const User = mongoose.model("User" ,  user_schema)