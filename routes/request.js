const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("User not found");
        }

        const allowedStatuses = ["interested", "ignored"];
        if (allowedStatuses.includes(status) === false) {
            return res.status(400).send("Invalid status value");
        }
        const exisitingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (exisitingRequest) {
            return res.status(400).send({ message: "Connection request already exists" });
        }
        console.log(fromUserId, toUserId, status, exisitingRequest);
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        const data = await connectionRequest.save();
        res.json({
            message: `Your connection request has been sent as ${status}`,
            data: data
        });

    } catch (err) {
        res.status(400).send(err.message);
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const { status, requestId } = req.params;
        const allowedStatuses = ["accepted", "rejected"];
        if (allowedStatuses.includes(status) === false) {
            return res.status(400).send("Invalid status value");
        }

        const connectionRequestBool = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId._id,
            status: "interested"
        });
        console.log(connectionRequestBool, requestId, loggedInUserId._id);
        if (!connectionRequestBool) {
            return res.status(400).send({ message: "No pending connection request found" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Connection request has been ${status}`,
            data: data
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});
module.exports = requestRouter;