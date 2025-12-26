import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import mongoose from 'mongoose';

export const getUserById = (req, res, next, id) => {
    console.log("id is:",id);
    
    PersonalSchema.findOne({user:id})
        .populate("user")
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: "User not found",
                    requestedId: id
                });
            }
            req.profile = user;
            next();
        })
};


export const getDeatils=(req,res)=>{
    res.json(req.profile)
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await FacultySchema.find({}).select('_id name email');
        res.json({
            count: users.length,
            users: users
        });
    } catch (err) {
        console.error("Error fetching all users:", err);
        res.status(500).json({
            error: "Failed to fetch users",
            details: err.message
        });
    }
};