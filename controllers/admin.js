import Admin from "../modals/admin.js"
import express from 'express'
import PersonalSchema from "../modals/PersonalSchema.js"
import Request from "../modals/request.js";
export const getadminByID = async (req, res, next, id) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }
    req.profile = admin;
    next();
  } catch (err) {
    return res.status(400).json({ error: "admin not found" });
  }
};

export const getAdminDetails = async (req, res) => {
  try {
    const faculties = await PersonalSchema
      .find()
      .populate({ path: "user", select: "email" })
      .select("personalData.name personalData.department personalData.designation");

    const result = faculties.map(({ user, _id, personalData }) => ({
      id: user._id,
      name: personalData.name,
      department: personalData.department,
      role: personalData.designation,
      email: user.email
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}

export const getRequests = async (req, res) => {
  if (req.profile.role === "ADMIN") {
    res.json(await Request.find())
  }
  else {
    return res.status(400).json({
      error: "are you kidding you are not admin"
    })
  }
}



export const acceptRequests = async (req, res) => {
  const { rid } = req.body
}
export const rejectRequests = async (req, res) => {

}