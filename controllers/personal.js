import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import mongoose from 'mongoose';
import Request from "../modals/request.js"
import { login } from "./auth.js";

export const getUserById = (req, res, next, id) => {
    PersonalSchema.findOne({ user: id })
        .populate({ path: "user", select: "email" })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: "User not found",
                    requestedId: id
                });
            }
            // req.profile = user;
            req.profile = { ...user.toObject(), role: "user" }
            next();
        })
};


export const getDeatils = (req, res) => {
    if (req.auth.role === "hod") {
        req.profile.role = "hod"
    }
    if (req.auth.role === "ofc") {
        req.profile.role = "ofc"
    }
    if (req.auth.role === "admin") {
        req.profile.role = "admin"
    }
    res.json(req.profile)
}

export const addRequests = async (req, res) => {
    try {
        if (!(req.profile.role === "user")) {
            return res.status(400).json({
                error: "first be an authenticated user then we can proceed "
            })
        }
        const { updatedFields, fields, subfields } = req.body
        const userId = req.profile.user._id
        const user = await PersonalSchema.findOne({ user: userId.toString() })
            .populate({ path: "user", select: "email" })
            .select(fields.join(" "))
        const originalProfile = {}
        for (const [key, value] of Object.entries(subfields)) {
            originalProfile[key] = {}
            for (const keyvalue of value) {
                originalProfile[key][keyvalue] = user[key][keyvalue]
            }
        }
        const request = await Request.create({
            user: userId,
            personal: user._id,
            originalProfile: originalProfile,
            updatedFields: updatedFields
        })
        res.json(request)
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch users",
            details: err.message
        });
    }
};