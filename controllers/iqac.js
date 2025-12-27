import express from "express"
import Iqac from "../modals/Iqac.js"
import PersonalSchema from "../modals/PersonalSchema.js"
export const getiqacByID = async (req, res, next, id) => {
  try {
    const iqac = await Iqac.findById(id);
    if (!iqac) {
      return res.status(404).json({ error: "iqac not found" });
    }
    req.profile = iqac;
    next();
  } catch (err) {
    return res.status(400).json({ error: "iqac not found" });
  }
};

export const getiqacDetails = async (req, res) => {
  try {
    const faculties = await PersonalSchema
  .find()
  .select("personalData.name personalData.department personalData.designation");

    return res.json({ faculties }); 
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}