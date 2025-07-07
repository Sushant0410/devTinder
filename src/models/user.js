const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid emails address: " + value);
            }
        },
    },
    password: {
        type: String,
        require: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Inter a strong password: " + value)
            }
        },
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        },
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "NA"
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id: user._id}, "Dev@Sushant$04", {
        expiresIn: "1d",
    });

    return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);