import { apierror } from "../utils/apierror.js";
import { asyncHANDLER } from "../utils/asyncHANDLER.js";
import { validateUser } from "../validations/data.validations.js";
import User, { User } from "../modals/user.modals.js";
import uploadOnClaudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apierror(500, "Error generating tokens");
  }
};

// Register
const registerUser = asyncHANDLER(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  validateUser(fullname, email, username, password);

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new apierror(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) throw new apierror(400, "Avatar is required");

  const avatar = await uploadOnClaudinary(avatarLocalPath);
  const coverimage = coverLocalPath
    ? await uploadOnClaudinary(coverLocalPath)
    : null;

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new apierror(500, "User creation failed");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Login
const login_user = asyncHANDLER(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new apierror(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new apierror(400, "User not registered");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new apierror(401, "Incorrect password");

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: safeUser, accessToken, refreshToken },
        "Login successful"
      )
    );
});

// Logout
const logoutUser = asyncHANDLER(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } });

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Refresh token
const RefreshAcessToken = asyncHANDLER(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apierror(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded?._id);
    if (!user) throw new apierror(401, "User not found");

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apierror(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apierror(401, "Invalid refresh token");
  }
});

// Change Current Password
const changeCurrentPassword = asyncHANDLER(async (req , res) => {
  const {oldPassword , newPassword } = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  
  if (!isPasswordCorrect) {
    throw new apierror(400 , " Invalid old password ")
  }

  user.password = newPassword
  user.save({validateBeforeSave : false})

  return res
  .status(200)
  .json(new ApiResponse(200 , {} , "Password changed succesfully"))
})

//Get current user
const getCurrentUser = asyncHANDLER(async (req , res) => {
  return res
  .status(200)
  .json(200 , req.user , "Current user Fetched Sucessfully")

}) 

//Update Account 
const Updateaccountdetails = asyncHANDLER(async (req , res) => {
  const {fullName , email} = req.body

  if (!fullName || !email) {
    throw new apierror(400 , "All fields are required")    
  }

  const user = User.findByIdAndUpdate(req.user?._id,
    {
      $set : {
        fullName , 
        email : email 
      }
    },
    {new:true}
    
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse
      (200 , user , "Account details updated sucessfully"))
})

//update avatar
const updateUserAvatar = asyncHANDLER (async (req , res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new apierror( 400 , "Avatar file is missing")
  }

  const avatar = await uploadOnClaudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new apierror( 400 , "Error while uploading on avatar")
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        avatar : avatar.url
      }
    }, 
    {new : true}
  ).select( "-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200 , user , "Cover image updated sucessfully")
    )
})

//update cover image
const updateUserCoverimge = asyncHANDLER (async (req , res) => {
  const CoverimageLocalPath = req.file?.path

  if (!CoverimageLocalPath) {
    throw new apierror( 400 , "Cover image file is missing")
  }

  const coverimage = await uploadOnClaudinary(CoverimageLocalPath)

  if (!coverimage.url) {
    throw new apierror( 400 , "Error while uploading on coverimage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        coverimage : coverimage.url
      }
    }, 
    {new : true}
  ).select( "-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200 , user , "Cover image updated sucessfully")
    )
})

//get Channel profile
const getUserChannelProfile = asyncHANDLER(async( req , res) => {
  const {username} = req.params

  if (!username?.trim()) {
    throw new apierror(400,"Username is missing")
  }

  const channel = await User.aggregate([
    {
      $match : {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField : "_id",
        foreignField : "channel" ,
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField : "_id",
        foreignField : "channel" ,
        as: "subscriberTo"
      }
    },
    {
      $addFields : {
        subscribersCount : {
          $size : "$subscribers"
        }, 
        channelSubscribersCount : {
          $size : "$subscriberTo"
        },
        isSubscribed : {
          $cond : {
            if : { $in : [req.user?._id , "$subscribers.subscriber"]},
            then : true ,
            else : false 
          }
        }
      }
    },
    {
      $project : {
        fullName : 1,
        username : 1,
        subscribersCount : 1,
        channelSubscribersCount : 1,
        avatar : 1,
        coverImage : 1,
        email : 1
      }
    }
  ])

  if (!channel?.length) {
    throw new apierror(404 , "Channel doesnt exists")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200 , channel[0] , "user channel fetched sucessfully")
  )
})

//Get watch history
const getWatchHistory = asyncHANDLER(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from : "videos",
        localField : "watchHistory" ,
        foreignField : "_id" ,
        as : "watchHistory" ,
        pipeline : [
          {
            $lookup : {
              from : "users" ,
              localField : "owner" , 
              foreignField : "_id" ,
              as : "owner" , 
              pipeline : [
                {
                  $project : {
                    fullName : 1,
                    username : 1,
                    avatar : 1
                  }
                }
              ]
            }
          },
          {
            $addFields : {
              owner : {
                $first : "$owner"
              }
            }
          }
        ]
      }
    }
  ]);

  return res
  .status(200)
  .json(
    new ApiResponse(
      200 , 
      user[0].watchHistory,
      "Watch History fetched sucessfully"
    )
  )
});


//Exporting all functions 
export { 
   registerUser, 
   login_user, 
   logoutUser, 
   RefreshAcessToken ,
   changeCurrentPassword , 
   getCurrentUser , 
   Updateaccountdetails , 
   updateUserAvatar , 
   updateUserCoverimge,
   getUserChannelProfile,
   getWatchHistory
  };
