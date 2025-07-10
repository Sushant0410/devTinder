const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest= require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        // const user = req.user;
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).send({message: "Invalid Status Type " + status});
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            res.status(404).json({message: "User Not Found!"})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                {fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res
            .status(400)
            .send({message: "Connection Request Already Exists!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const connectionData = await connectionRequest.save();

        res.json({
            success: true,
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            connectionData,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});



module.exports = requestRouter;