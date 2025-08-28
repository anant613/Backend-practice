import { apierror } from "../utils/apierror.js";
import { asyncHANDLER } from "../utils/asyncHANDLER.js";
import { validateUser } from "../validations/data.validations.js";
import User from "../modals/user.modals.js";
import uploadOnClaudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

export { registerUser, login_user, logoutUser, RefreshAcessToken };
