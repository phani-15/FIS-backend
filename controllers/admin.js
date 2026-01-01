import Admin from "../modals/admin.js"
import express from 'express'
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

export const printdet = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    admin: {
      
      _id: req.profile._id,
      email: req.profile.email,
    },
  });
};

