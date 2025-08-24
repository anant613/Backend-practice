import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnClaudinary = async(localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })

        //file has been uploaded successfully
        console.log("file is uploaded sucessfully",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export{uploadOnClaudinary}