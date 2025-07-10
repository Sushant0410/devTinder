const express = require("express");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send({success:false, msg: err.message})
    }
    
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request!");
        }

        const loogedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loogedInUser[key] = req.body[key]));

        const updatedUserData = await loogedInUser.save();
        res.status(200).send({success: true, msg: "Your profile updated successfully", data: updatedUserData});
    } catch (err) {
        res.status(400).send({success: false, mag: err.message});
    }
});

module.exports = profileRouter;