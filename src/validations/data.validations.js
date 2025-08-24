import { apierror } from "../utils/apierror";

const validateUser = (fullName, email, username, password) => {
    //checking if fields are empty
    if ([fullName, email, username, password].some((field) => field?.trim() === "")
    ){ 
        throw new apierror(400,"All fields are mandotary")
    }

    //checking the username
    if (fullName.length < 3) {
        throw new apierror(400,"Name should be minimum of 3 letters")
    }

    //USERNAME VALIDATION
    if (username.length < 3 || username.length > 20) {
        throw new apierror(400, "USERNAME MUST BE BETWEEN 3 AND 20 CHARACTERS");
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new apierror(400, "Invalid email format");
    }

    // PASSWORD VALIDATION
    if (password.length < 8) {
        throw new apierror(400, "Password must be at least 8 characters long");
    }
}

export { validateUser };