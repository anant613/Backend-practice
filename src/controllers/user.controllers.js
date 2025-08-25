import { apierror } from "../utils/apierror";
import { asyncHANDLER } from "../utils/asyncHANDLER.JS";
import { validateUser } from "../validations/data.validations.js";
import User from "../modals/user.modals.js";
import uploadOnClaudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHANDLER( async (req,res) => {
      //take the details from the user
      const {fullname, email, username, password} = req.body

      console.log("email:", email);

      //validation
      validateUser(fullName, email, username, password);

      //check if user already exists
      const Existed_user = await User.findOne({
        $or:[{ username } , { email }]
      })

      if(Existed_user){
        throw new apierror(409 , "User with this email or username already exists. Please try a different one.")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path;
      //const CoverphotoLocalPath = req.files?.coverimage[0]?.path;

      let CoverphotoLocalPath;
      if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        CoverphotoLocalPath =req.files.coverimage[0].path
      }

      //check if required details are entered images and avtar
      if(!avatarLocalPath){
        throw new apierror(400,"Avatar file is required")
      }

      //upload them on cloudinary,avtar
      const avatar = await uploadOnClaudinary(avatarLocalPath)
      const coverimage = await uploadOnClaudinary(CoverphotoLocalPath)

      if (!avatar) {
        throw new apierror(400,"Avatar file is required")
      }
      
      //create user object - Create entry in database
      const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase()
      })

      //Remove password and refresh token field from response
      //check for user creation weather it is actually a user or null

      const createuser = await user.findById(user._id).select(
        "-password -refreshtoken"
      )

      //throwing error if user not created

      if (!createuser) {
        throw new apierror(500 , "Something went wrong while registring user")
      }
      //return response  
      return res.status(201).json(
        new ApiResponse(200, createuser ,"user registered sucessfully")
      )

})
res.status(201).json({
    success: true,
    message: "User registered successfully (DB logic yet to be added)",
    data: {
      fullName,
      email,
      username,
    },
  });

export {registerUser};