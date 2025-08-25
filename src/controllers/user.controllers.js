import { apierror } from "../utils/apierror";
import { asyncHANDLER } from "../utils/asyncHANDLER.JS";
import { validateUser } from "../validations/data.validations.js";
import User from "../modals/user.modals.js";
import uploadOnClaudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken
       const Refreshtoken = user.generateRefreshToken

       user.Refreshtoken = Refreshtoken
       await user.save({validateBeforeSave : false})
       
       return {accessToken , Refreshtoken}

    } catch (error) {
        throw new apierror(500,"Something went wrong while generating access and refresh token")
    }
}

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

const login_user = asyncHANDLER(async (req,res) => {
    //req body -> data
    //username or email
    //find the user and check
    //password check
    //access and refresh token
    //send in coookies
    //send response

    //request body
    const {email,username,password} = req.body

    if (!username || !email) {
        throw new apierror(400,"Username or password is required")
    }

    //username or email
    const user = await User.findOne({
        $or:[{username} , {email}]
    })

    //checking the user
    if (!user) {
        throw new apierror(400,"User is not registered")
    }

    //check password
    const PasswordCheck = await user.isPasswordCorrect(password)

    if (!PasswordCheck) {
        throw new apierror(401,"Password is incorrect")
    }

    //access and refresh token
    const {accessToken, Refreshtoken} = await generateAccessAndRefreshTokens(user._id)
    
    const login_user = await  User.findById(user._id).select("-password -Refreshtoken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("Accesstoken" , accessToken , options)
    .cookie("refreshtoken" , Refreshtoken , options)
    .json(
        new ApiResponse(
            200,{
                user: login_user , accessToken , Refreshtoken
            },
            "User logged in succesfully"
        )
    )

})

const logoutUser = asyncHANDLER(async(req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                Refreshtoken : undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessTokens" , options)
    .clearCookie("Refreshtoken" , options)
    .json( new ApiResponse( 200 , {} , "User logged out succesfully!!"))
})

export {
    registerUser
    ,login_user
    ,logoutUser
};