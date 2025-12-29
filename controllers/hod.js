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
const parseDDMMYYYY = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split(":");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

    

export const extractDetails = async (req, res) => {
  try {
    const { types, fields, dateFrom, dateTo } = req.body;

    if (!types || types.length === 0) {
      return res.status(400).json({ message: "No report types selected" });
    }

    const branch = req.hod.department; // assuming HOD has department info

    const faculties = await PersonalSchema
      .find({ department: branch })
      .populate({
        path: "credentials",
        select: types.join(" ")
      });

    const fromDate = parseDDMMYYYY(dateFrom);
    const toDate   = parseDDMMYYYY(dateTo);
      if (fromDate && isNaN(fromDate)) {
  return res.status(400).json({ message: "Invalid dateFrom format. Use DD:MM:YYYY" });
}
if (toDate && isNaN(toDate)) {
  return res.status(400).json({ message: "Invalid dateTo format. Use DD:MM:YYYY" });
}
if (toDate) {
  toDate.setHours(23, 59, 59, 999);
}


    const result = [];

    faculties.forEach((faculty) => {
      const entry = {
        facultyName: faculty.name,
        designation: faculty.designation,
        email: faculty.email,
        reports: {}
      };

      types.forEach((type) => {
        const records = faculty.credentials?.[type];
        if (!Array.isArray(records)) return;

        const selectedFields = fields[type] || [];

        const filtered = records
          .filter((r) => {
            if (!fromDate && !toDate) return true;

            const dateVal = r.date || r.year;
            if (!dateVal) return true;

            const recordDate = new Date(dateVal);
            if (fromDate && recordDate < fromDate) return false;
            if (toDate && recordDate > toDate) return false;

            return true;
          })
          .map((r) => {
            const obj = {};
            selectedFields.forEach((f) => {
              obj[f] = r[f] ?? "";
            });
            return obj;
          });

        if (filtered.length > 0) {
          entry.reports[type] = filtered;
        }
      });

      if (Object.keys(entry.reports).length > 0) {
        result.push(entry);
      }
    });

    res.status(200).json({
      success: true,
      totalFaculty: result.length,
      data: result
    });

  } catch (error) {
    console.error("HOD extract error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to extract reports",
      error: error.message
    });
  }
};
  