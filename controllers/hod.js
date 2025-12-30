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
    .populate("user" ,"email")
    .select("_id personalData.name personalData.designation ")
    return res.json({ faculties ,role:"hod"});
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}
const parseDDMMYYYY = (str) => {
  if (!str) return null;
  const parts = str.split(":");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;

  return new Date(yyyy, mm - 1, dd);
};

const extractDateFromRecord = (record) => {
  let yearFallback = null;

  for (const key of Object.keys(record)) {
    const lowerKey = key.toLowerCase();
    const value = record[key];

    if (lowerKey.includes("date")) {
      const d = new Date(value);
      if (!isNaN(d)) return d;
    }

    if (lowerKey.includes("year")) {
      if (typeof value === "string" && value.includes("-")) {
        const y = parseInt(value.split("-")[0]);
        if (!isNaN(y)) yearFallback = new Date(y, 0, 1);
      }

      const y = parseInt(value);
      if (!isNaN(y)) yearFallback = new Date(y, 0, 1);
    }
  }

  return yearFallback;
};

export const extractDetails = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    const { types, fields, dateFrom, dateTo } = req.body;

    if (!types || types.length === 0) {
      return res.status(400).json({ message: "No report types selected" });
    }

    console.log("👤 HOD profile:", req.profile);
    console.log("🏫 HOD department:", req.profile?.department);

    const branch = req.profile.department;

    // Step 1: Fetch faculty
   const faculties = await PersonalSchema.find(
  { "personalData.department": branch },
  "personalData user credentials"
).populate("user", "email");



    console.log("👥 Faculty count:", faculties.length);

    const fromDate = parseDDMMYYYY(dateFrom);
    const toDate = parseDDMMYYYY(dateTo);

    console.log("📅 Parsed fromDate:", fromDate);
    console.log("📅 Parsed toDate:", toDate);

    if (dateFrom && !fromDate) {
      return res.status(400).json({ message: "Invalid dateFrom format. Use DD:MM:YYYY" });
    }

    if (dateTo && !toDate) {
      return res.status(400).json({ message: "Invalid dateTo format. Use DD:MM:YYYY" });
    }

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const result = [];

    // Step 2: Loop faculty → check credentials
    for (const faculty of faculties) {
      console.log("➡️ Processing faculty:", faculty.personalData.name, faculty.credentials);

      const credentials = await Credentials.findById(faculty.credentials);
      
      console.log("📂 Credentials found:",  credentials);

      if (!credentials) continue;

    const entry = {
  facultyName: faculty.personalData.name,
  designation: faculty.personalData.designation,
  email: faculty.user?.email || "",
  reports: {}
};


      types.forEach((type) => {
        const records = credentials[type];

        console.log(`📄 Checking type "${type}" → records:`, Array.isArray(records) ? records.length : "NOT ARRAY");

        if (!Array.isArray(records)) return;

        const selectedFields = fields[type] || [];

        const filtered = records
          .filter((record) => {
            const recordDate = extractDateFromRecord(record);

            console.log("🧾 Record:", record);
            console.log("📆 Extracted recordDate:", recordDate);

            if (!fromDate && !toDate) return true;
            if (!recordDate) return true;

            if (fromDate && recordDate < fromDate) return false;
            if (toDate && recordDate > toDate) return false;

            return true;
          })
          .map((record) => {
            const obj = {};
            selectedFields.forEach((f) => {
              obj[f] = record[f] ?? "";
            });
            return obj;
          });

        console.log(`✅ Filtered count for "${type}":`, filtered.length);

        if (filtered.length > 0) {
          entry.reports[type] = filtered;
        }
      });

      if (Object.keys(entry.reports).length > 0) {
        result.push(entry);
      }
    }

    console.log("📊 Final result size:", result.length);

    return res.status(200).json({
      success: true,
      totalFaculty: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ HOD extract error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract reports",
      error: error.message
    });
  }
};
