🛡️🔒 VALIDATIONS IN BACKEND

Validations are important because they make sure that the data coming from the user is clean, correct, and safe before we store it in the database. Without validations, users might enter empty fields, wrong formats, or even malicious data. In our backend, we add validation checks whenever a user tries to register, log in, or update their profile.

For registration, we make sure that the full name, email, username, and password are all present and not left empty. The full name should have at least 3 characters and should only contain alphabets and spaces. The email must follow the proper format (like user@example.com) so that it is valid. The username should be between 3 to 20 characters, should not contain spaces, and can only include letters, numbers, underscores, and dots.

The password is one of the most important fields, so we make sure it is strong. It should be at least 8 characters long and must include at least one uppercase letter, one lowercase letter, one number, and one special character. This prevents users from choosing weak passwords like 12345678 or password.

There are also some optional fields that can be validated. For example, if the user uploads an avatar or profile image, we only allow file formats like JPG, PNG, or WebP. If a phone number is provided, it should be exactly 10 digits. If an age is given, it should be a realistic number, like between 13 and 120.

If any of these rules are not followed, the server will immediately return an error response (like 400 Bad Request) with a proper message telling the user what went wrong. If everything is valid, only then the request is passed on to the controller where the actual logic of creating or updating the user is handled.

Using validations ensures that our backend is secure, reliable, and consistent. It also improves user experience by giving them clear feedback whenever they enter wrong details.