import express from "express"
import Hod from "../modals/hod.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import Credentials from '../modals/AddDetails.js'

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
      .populate("user", "email")
      .select("_id personalData.name personalData.designation ")
    return res.json({ faculties, role: "hod" });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}
const parseDate = (value) => {
  if (!value) return null;

  // 1️⃣ ISO / browser-supported formats (YYYY-MM-DD, full ISO, timestamps)
  const iso = new Date(value);
  if (!isNaN(iso.getTime())) return iso;

  // 2️⃣ DD-MM-YYYY explicitly
  if (typeof value === "string") {
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
      const [, dd, mm, yyyy] = match;
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }
  }

  return null;
};



const extractDateFromRecord = (record) => {
  let yearFallback = null;

  for (const key of Object.keys(record)) {
    const lowerKey = key.toLowerCase();
    const value = record[key];

    // 1️⃣ Handle date fields safely
    if (lowerKey.includes("date") && typeof value === "string") {
      // Try DD-MM-YYYY first
      const parsed = parseDate(value);
      if (parsed) return parsed;

      // Try ISO / JS supported formats
      const d = new Date(value);
      if (!isNaN(d)) return d;
    }

    // 2️⃣ Handle year fields
    if (lowerKey.includes("year")) {
      if (typeof value === "string") {
        // "2019-2020"
        const y = parseInt(value.split("-")[0]);
        if (!isNaN(y)) yearFallback = new Date(y, 0, 1);
      } else if (typeof value === "number") {
        yearFallback = new Date(value, 0, 1);
      }
    }
  }

  return yearFallback;
};


export const extractDetails = async (req, res) => {
  try {

    const { types, fields, dateFrom, dateTo } = req.body;

    if (!types || types.length === 0) {
      return res.status(400).json({ message: "No report types selected" });
    }

    const branch = req.profile.department;

    // Step 1: Fetch faculty
    const faculties = await PersonalSchema.find(
      { "personalData.department": branch },
      "personalData user credentials"
    ).populate("user", "email");

    const fromDate = parseDate(dateFrom);
    const toDate = parseDate(dateTo);

    if (dateFrom && !fromDate) {
      return res.status(400).json({ message: "Invalid dateFrom format. Use DD:MM:YYYY" });
    }

    if (dateTo && !toDate) {
      return res.status(400).json({ message: "Invalid dateTo format. Use DD:MM:YYYY" });
    }

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const reports = [];

    // Step 2: Loop faculty → check credentials
    for (const faculty of faculties) {

      const credentials = await Credentials.findById(faculty.credentials);

      if (!credentials) continue;

      const entry = {
        facultyName: faculty.personalData.name,
        designation: faculty.personalData.designation,
        email: faculty.user?.email || "",
        reports: {}
      };

      types.forEach((type) => {
        const records = credentials[type];

        if (!Array.isArray(records)) return;

        const selectedFields = fields[type] || [];

        const filtered = records
          .filter((record) => {
            const recordDate = extractDateFromRecord(record);

            if (!fromDate && !toDate) return true;
            if (!recordDate) return true;

            if (fromDate && recordDate < fromDate) return false;
            if (toDate && recordDate > toDate) return false;

            return true;
          })
          .map((record) => {
            const obj = {};
            selectedFields.forEach((f) => {
              obj[f] = record[f] || "";
            });
            return obj;
          });

        if (filtered.length > 0) {
          entry.reports[type] = filtered;
        }
      });

      if (Object.keys(entry.reports).length > 0) {
        reports.push(entry);
      }
    }

    return res.status(200).json({
      success: true,
      totalFaculty: reports.length,
      data: reports
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to extract reports",
      error: error.message
    });
  }
};
