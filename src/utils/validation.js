const validator = require('validator');

validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and Last name is require");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email id is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
}

module.exports  = {
    validateSignUpData,
}