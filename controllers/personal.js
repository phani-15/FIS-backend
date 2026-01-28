import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import mongoose from 'mongoose';
import Request from "../modals/request.js"
import Credentials from "../modals/AddDetails.js"
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
        if (req.profile.role !== "user") {
            return res.status(400).json({
                error: "You must be an authenticated user to perform this action"
            });
        }

        const { updatedFields, fields, subfields } = req.body;
        const userId = req.profile.user._id;
        const personalId = req.profile._id;

        // 1. Fetch Credentials Document using the reference in Personal profile
        const credentialsDoc = await Credentials.findOne({ _id: req.profile.credentials });
        if (!credentialsDoc) {
            return res.status(404).json({
                error: "Credentials profile not found for this user"
            });
        }

        // 2. Check 7-Day Window
        const joinDate = new Date(req.profile.createdAt);
        const daysSinceJoin = (Date.now() - joinDate) / (1000 * 60 * 60 * 24);
        const isWithinWindow = daysSinceJoin <= 7;

        if (isWithinWindow) {
            // --- DIRECT UPDATE LOGIC ---
            for (const field of fields) {
                if (!updatedFields[field]) continue;

                // Handle array operations for credential fields (patents, foreign_visits, etc.)
                for (const item of updatedFields[field]) {
                    const { _operation, _index, ...cleanItem } = item;

                    if (_operation === 'add') {
                        if (!credentialsDoc[field]) credentialsDoc[field] = [];
                        credentialsDoc[field].push(cleanItem);
                    } else if (_operation === 'edit') {
                        if (credentialsDoc[field] && credentialsDoc[field][_index]) {
                            credentialsDoc[field][_index] = cleanItem;
                        }
                    } else if (_operation === 'delete') {
                        if (credentialsDoc[field]) {
                            credentialsDoc[field].splice(_index, 1);
                        }
                    }
                }
                credentialsDoc.markModified(field);
            }

            // Save directly without validation to avoid potential schema strictness issues
            await credentialsDoc.save({ validateBeforeSave: false });

            return res.json({
                success: true,
                message: "Profile updated directly (within 7-day registration window)",
                method: "direct_update"
            });

        } else {
            // --- REQUEST CREATION LOGIC ---

            // Check Request Limit (Max 10 pending requests)
            const pendingCount = await Request.countDocuments({ user: personalId, isPending: true });
            if (pendingCount >= 10) {
                return res.status(400).json({
                    error: "Request limit reached. You cannot have more than 10 pending requests."
                });
            }

            // Generate Original Profile for the requested fields
            const originalProfile = {};
            for (const field of fields) {
                originalProfile[field] = [];
                // Pick specific items if indices are provided in subfields
                if (subfields && subfields[field]) {
                    for (const idx of subfields[field]) {
                        if (credentialsDoc[field] && credentialsDoc[field][idx]) {
                            originalProfile[field].push(credentialsDoc[field][idx]);
                        }
                    }
                }
            }

            const request = await Request.create({
                user: userId,     // Using Personal ID as per schema ref
                personal: personalId, // Using Personal ID
                originalProfile: originalProfile,
                updatedFields: updatedFields,
                model: "Credentials"
            });

            return res.json({
                success: true,
                message: "Request submitted successfully for admin approval",
                method: "request_created",
                request
            });
        }

    } catch (err) {
        console.error("Error in addRequests:", err);
        res.status(500).json({
            error: "Failed to process request",
            details: err.message
        });
    }
};

export const updatePersonal = async (req, res) => {
    try {
        if (!(req.profile.role === "user" || req.profile.role === "hod" || req.profile.role === "admin")) {
            return res.status(400).json({
                error: "You must be an authenticated user to update profile"
            });
        }
        const { updatedFields, fields, subfields } = req.body;
        const userId = req.profile.user._id;
        const user = await PersonalSchema.findOne({ user: userId.toString() });
        if (!user) {
            return res.status(404).json({
                error: "User profile not found"
            });
        }
        for (const field of fields) {
            if (!updatedFields[field]) continue;
            if (field === 'education') {
                for (const [eduSection, eduData] of Object.entries(updatedFields.education)) {
                    // Handle flat education sections (tenth, twelth, degree, pg)
                    if (['tenth', 'twelth', 'degree', 'pg'].includes(eduSection)) {
                        for (const [key, value] of Object.entries(eduData)) {
                            if (eduSection === 'twelth' && key === 'type') {
                                user.education[eduSection][key] = value.toLowerCase();
                            } else {
                                user.education[eduSection][key] = value;
                            }
                        }
                    }
                    else if (['phd', 'postdoc'].includes(eduSection)) {
                        for (const item of eduData) {
                            if (item._operation === 'add') {
                                // Remove operation markers before adding
                                const { _operation, ...cleanItem } = item;
                                user.education[eduSection].push(cleanItem);
                            } else if (item._operation === 'edit') {
                                // Update existing item at index
                                const { _operation, _index, ...cleanItem } = item;
                                if (user.education[eduSection][_index]) {
                                    user.education[eduSection][_index] = cleanItem;
                                }
                            } else if (item._operation === 'delete') {
                                // Remove item at index
                                user.education[eduSection].splice(item._index, 1);
                            }
                        }
                    }
                }
                user.markModified('education');
            }
            else if (['experience', 'administrativeService', 'otherAdministrativeService'].includes(field)) {
                for (const item of updatedFields[field]) {
                    if (item._operation === 'add') {
                        // Remove operation markers before adding
                        const { _operation, ...cleanItem } = item;
                        user[field].push(cleanItem);
                    } else if (item._operation === 'edit') {
                        // Update existing item at index
                        const { _operation, _index, ...cleanItem } = item;
                        if (user[field][_index]) {
                            user[field][_index] = cleanItem;
                        }
                    } else if (item._operation === 'delete') {
                        // Remove item at index
                        user[field].splice(item._index, 1);
                    }
                }
            }
            else if (field === 'personalData') {
                for (const [key, value] of Object.entries(updatedFields[field])) {
                    user.personalData[key] = value;
                }
                user.markModified('personalData');
            }
            else if (field === 'user') {
                for (const [key, value] of Object.entries(updatedFields[field])) {
                    user.user[key] = value;
                }
                user.markModified('user');
            }
        }
        // Save without validation to avoid credentials and other validation issues
        await user.save({ validateBeforeSave: false });
        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: user
        });

    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({
            error: "Failed to update profile",
            details: err.message
        });
    }
};