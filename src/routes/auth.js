const express = require("express");
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // validate data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const userData = await user.save();
        res.status(200).send({success:true, msg:"User added successfully!", data: userData});
    } catch (err) {
        res.status(400).send({sucess:false, msg: err.message})
    }
    
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});

        if (!user) {
            throw new Error("User not found!");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token);
            res.status(200).send({success:true, msg:"Login successfully!", data: user});
        } else {
            throw new Error("Invalid password!");
        }
    } catch (err) {
        res.status(400).send({sucess:false, msg: err.message})
    }
});

module.exports = authRouter;