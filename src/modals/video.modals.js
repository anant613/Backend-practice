import { Timestamp } from "bson";
import mongoose , {Schema, SchemaType} from "mongoose";
import { types } from "util";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const Video_schema = new Schema({
    Videofile : {
        type : String,
        require : true
    },
    thumbnail:{
        type:String , 
        require: true
    },
    title:{
        type:String , 
        require: true
    },
    views:{
        type: Number , 
        default:0
    },
    description:{
        type : String,
        require : true,
    },
    duration:{
        type:Number,
        require:true
    },
    isPublished:{
        type: Boolean , 
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

Video_schema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , Video_schema)