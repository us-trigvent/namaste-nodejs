const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
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

userRouter.get('/feed', userAuth, async (req, res) => {
    const page = req.query.page || 1
    let limit = req.query.limit || 10
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const loggedInUserId = req.user._id;
    const connectionUserId = await ConnectionRequest.find({
        $or: [
            { toUserId: loggedInUserId.toString() },
            { fromUserId: loggedInUserId.toString() }
        ]
    });
    const hideUsersFromFeed = new Set();
    connectionUserId.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
        $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { id: { $ne: loggedInUserId } }
        ]

    }).select(SAFE_DATA_FIELDS).skip(skip).limit(limit)
    res.send({
        message: "Users fetched successfully",
        data: users
    })
})

module.exports = userRouter;