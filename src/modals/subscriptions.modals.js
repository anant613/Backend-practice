import { Schema } from "mongoose";

const subscriptions_schema = new Schema ({
    subscribers :{
        type : Schema.Types.ObjectId, //one who is subsrcibing 
        ref : "User"
    },
    users : {
        type : Schema.Types.ObjectId, //channel subsrcibed 
        ref : "User"
    }
},{timestamps : true})


export const subscriptions = moongose.model( "subscriptions" , subscriptions_schema )