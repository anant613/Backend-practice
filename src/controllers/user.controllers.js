import { asyncHANDLER } from "../utils/asyncHANDLER.JS";

const registerUser = asyncHANDLER( async (req,res) => {
     res.status(200).json({
        message: "ok"
    })
} )

export {registerUser}