import { User } from "../modals/user.modals"
import { apierror } from "../utils/apierror"
import {asyncHANDLER} from "../utils/asyncHANDLER"
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHANDLER(async(req,res,next) => 
 {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if (!token) {
            throw new apierror(401,"Unauthorized request")
        }
    
        const decoded_token = jwt.verify(token , proccess.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decoded_token?._id).select(" -password -Refreshtoken")
    
        if (!user) {
            //frontend need
            throw new apierror(401,"Invalid access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new apierror(401 , error?.message || "Invalid access token")
    }

})