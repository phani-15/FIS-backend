import express from "express"
import Hod from "../modals/hod.js"
import PersonalSchema from "../modals/PersonalSchema.js"

export const gethodByID = async (req, res, next, id) => {
  try {
    const hod = await Hod.findById(id);
    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }
    req.profile = hod;
    next();
  } catch (err) {
    return res.status(400).json({ error: "HOD not found" });
  }
};

export const gethodDetails = async (req, res) => {
  try {
    const faculties = await PersonalSchema.find({ "personalData.department": req.profile.department })
    .populate("user" ,"email")
    .select("_id personalData.name personalData.designation ")
    return res.json({ faculties ,role:"hod"});
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}