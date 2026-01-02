import express from "express"
import Iqac from "../modals/Iqac.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import {filterCredentialsByDate,filterSubfields} from "../utils/reportGeneration.js"

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
      .populate({ path: "user", select: "email" })  //this seems annoying to me bbut it works for some reason
      .select("personalData.name personalData.department personalData.designation");

    //rhis is only cause the frontend dev used to see this pretty annoying format 😭😮‍💨😮‍💨
    const result = faculties.map(({ user, _id, personalData }) => ({
      _id:user.id,
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

export const getFacultyforReport = async (req, res) => {  
  const { branch, fields } = req.body
  const selectString = fields.join(" ")  //select the relveant fields
  const faculties= await PersonalSchema.find({ "personalData.department": {$in:branch} })
    .populate({ path: "credentials", select: selectString })
  const returnNonEmptyFields=(credentials)=>{
    for (const key in fields){
      if(!credentials[fields[key]].length>0){
        return false;
      }}
    return true;
  }
  const results = faculties
  .filter(({credentials})=>(returnNonEmptyFields(credentials)))
  .map(({_id, personalData}) => (
    {
    dept:personalData.department,
    name: personalData.name,
    id:_id ,
  } 
))
  res.json(results)

}

export const getReportDataForAll = async (req, res) => {
  const { branch, fields, subfields } = req.body
  const selectString = fields.join(" ")  //select the relveant fields
  const faculties = await PersonalSchema.find({ "personalData.department": branch })
    .populate({ path: "credentials", select: selectString })

  //filtering subfileds 
  const filterSubfields = (credentials, subfields) => {
    const result = {};
    for (const field in credentials) {
      const items = credentials[field];
      if (!subfields[field]) {
        result[field] = items;
        continue;
      }
      result[field] = items.map(item => {
        const filteredItem = {};
        for (const key of subfields[field]) {
          if (item[key] !== undefined) {
            filteredItem[key] = item[key];
          }
        }
        return filteredItem;
      });
    }
    return result;
  };

  const results = faculties.map(({ personalData, credentials }) => ({
    name: personalData.name,
    role: personalData.designation,
    department: personalData.department,
    data: filterSubfields(credentials.toObject(), subfields)
  }))
  res.json(results)
}
export const getReportDataForSome = async (req, res) => {
  try {
    const { fields, subfields, ids, from_date, to_date } = req.body;
    const selectString = fields.join(" ");
    const faculties = await PersonalSchema.find({
      _id: { $in: ids }
    }).populate({
      path: "credentials",
      select: selectString
    });
    const results = faculties
      .map(({ _id,personalData, credentials }) => {
        const credentialsObj = credentials.toObject();
        const dateFiltered = filterCredentialsByDate(
          credentialsObj,
          from_date,
          to_date
        );
        const finalData = filterSubfields(dateFiltered, subfields);
        //remove faculty with no valid data
        if (Object.keys(finalData).length === 0) return null;
        return {
          name: personalData.name,
          role: personalData.designation,
          dept: personalData.department,
          data: finalData,
          id:_id.toString()
        };
      })
      .filter(Boolean);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate report"
    });
  }
};