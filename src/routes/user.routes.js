import { Router } from "express";
import { RefreshAcessToken, login_user, logoutUser, registerUser } from "../controllers/user.controllers.js";
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

export default router

