import { apierror } from "../utils/apierror";
import { asyncHANDLER } from "../utils/asyncHANDLER.JS";
import { validateUser } from "../validations/data.validations.js";

const registerUser = asyncHANDLER( async (req,res) => {
      //take the details from the user
      const {Fullname, email, username, password} = req.body

      console.log("email:", email);

      //validation
      validateUser(fullName, email, username, password);

      //check if user already exists
      //check if required details are entered images and avtar
      //upload them on cloudinary,avtar
      //create user object - Create entry in database
      //Remove password and refresh token field from response
      //check for user creation weather it is actually a user or null
      //return response  

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