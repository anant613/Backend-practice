import { Router } from "express";
import { RefreshAcessToken, Updateaccountdetails, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, login_user, logoutUser, registerUser, updateUserAvatar, updateUserCoverimge } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multi.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
       {
        name: "avatar",
        maxCount:1
       },
       {
        name:"CoverImage",
        maxCount:1
       }
    ]),
    registerUser
    )

router.route("/login").post(login_user)

//secured routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(RefreshAcessToken)
router.route("/change-password").post(verifyJWT , changeCurrentPassword)
router.route("/current-user").get(verifyJWT , getCurrentUser)
router.route("/update-account").patch(verifyJWT , Updateaccountdetails)
router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)
router.route("/cover-image").patch(verifyJWT , upload.single("/coverImage") , updateUserCoverimge)
router.route("/c/:username").get(verifyJWT , getUserChannelProfile)
router.route("/history").get(verifyJWT , getWatchHistory)

export default router

