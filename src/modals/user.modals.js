const { Schema } = require("mongoose");

import mongoose , {Schema} from "mongoose";

const user_schema = new Schema({
    username : {
        type : String,
        unique : true,
        require : true,
        lowerase : true,
        index : true
    },
    email : {
        type : String,
        unique : true,
        require : true,
        lowerase : true
    },
    Fullname : {
        type : String,
        require : true,
        lowerase : true,
        index : true
    },
    avatar :{
        type : String,
        require : true
    },
    CoverImage :{
        type : String
    },
    watchHistory :{
        type: Schema.Types.ObjectId,
        ref : "Video"
    },
    password:{
        type:String,
        required : [true,'Password is required']
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

export const User = mongoose.model("User" ,  user_schema)