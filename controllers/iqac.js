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
      .populate({path:"user",select:"email"})  //this seems annoying to me bbut it works for some reason
      .select("personalData.name personalData.department personalData.designation");

      //rhis is only cause the frontend dev used to see this pretty annoying format 😭😮‍💨😮‍💨
    const result = faculties.map(({ user,_id, personalData }) => ({
      _id,
      name: personalData.name ,
      department: personalData.department ,
      role: personalData.designation ,
      email:user.email
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}