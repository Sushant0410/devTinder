const validator = require('validator');

const validateSignUpData = (req) => {
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
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "gender",
        "age",
        "skills",
        "about",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

module.exports  = {
    validateSignUpData,
    validateEditProfileData,
}