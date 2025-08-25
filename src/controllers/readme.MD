REGISTER USER

📝 1. Collect User Details

Gather required information from the user (through request body or form):
Name / Username
Email Address
Password
Profile Avatar (image upload)
Optional fields may include bio, phone number, etc.

✅ 2. Validate Input Data

Ensure all mandatory fields are provided.
Apply input validation rules:
Email format validation.
Password strength (minimum length, special characters, etc.).
Username constraints (length, allowed characters).
Return a validation error if any field is invalid or missing.

🔎 3. Check for Existing User

Query the database to see if a user with the given email or username already exists.
If found, return a 409 Conflict response (user already exists).

🖼️ 4. Verify Avatar / Image Upload

Check if the user has provided an avatar/profile image.
If missing, either:
Assign a default avatar, or
Return an error requesting the user to upload one.

☁️ 5. Upload Media to Cloudinary

Use Cloudinary (or similar service) to upload the provided avatar.
Retrieve and store the secure image URL from Cloudinary.
This ensures scalability and optimized image delivery.

🛠️ 6. Create User Object

Construct a new user object with:
Username
Email
Encrypted password (hashed using bcrypt/argon2)
Cloudinary avatar URL
Any other details (roles, bio, etc.)

💾 7. Insert User into Database

Save the user object into the database (MongoDB, PostgreSQL, etc.).
Ensure unique constraints (email, username) are enforced.

🔒 8. Exclude Sensitive Data

Remove the following before sending response back:
password
refreshToken (if stored in DB)
This prevents sensitive data leaks.

✅ 9. Verify User Creation

Double-check that the database insertion was successful.
If null or failed, return an error response.
Otherwise, proceed to send confirmation.

📤 10. Return Response

Send a structured response containing safe user details

🚀 Summary

This flow ensures:
Proper validation & uniqueness checks.
Secure handling of passwords and tokens.
Optimized image storage via Cloudinary.
Clean response format without exposing sensitive data.