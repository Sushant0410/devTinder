const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = mongoose.model("User", userSchema);