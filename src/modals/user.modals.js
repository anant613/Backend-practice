const { Schema } = require("mongoose");

import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

user_schema.pre("save",async function (next) {
    if(!this.isModified("password")){
         return next();
    }
    this.password = bcrypt.hash(this.password,10)
    next()
})

user_schema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


user_schema.methods.generateAccessToken = function (){
    return jwt.sign(
  
      {
            _id:this._id,
            email:this.email,
            username:this.username,
            Fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

user_schema.methods.generateRefreshToken = function (){
    return jwt.sign(
  
      {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
user_schema.methods.generateRefreshToken = function (){}

export const User = mongoose.model("User" ,  user_schema)