const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const SAFE_DATA_FIELDS = ['firstName', 'lastName', 'email', 'photoUrl', 'about'];
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate('fromUserId', SAFE_DATA_FIELDS);
        res.json({
            message: "Connection requests retrieved successfully",
            data: connectionRequests
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: "accepted" },
                { toUserId: loggedInUserId, status: "accepted" }
            ]
        }).populate('fromUserId', SAFE_DATA_FIELDS).populate('toUserId', SAFE_DATA_FIELDS);
        const data = connectionRequests.map(request => {
            if (request.fromUserId._id.toString() === loggedInUserId.toString()) {
                return request.toUserId;
            }
            return request.fromUserId;
        });

        res.json({
            message: "Connections retrieved successfully",
            data: data
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = userRouter;