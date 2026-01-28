import Admin from "../modals/admin.js"
import express from 'express'
import PersonalSchema from "../modals/PersonalSchema.js"
import Request from "../modals/request.js";
import Credentials from "../modals/AddDetails.js";
import Hod from "../modals/hod.js"
import { sendDataUpdateEmail } from "../utils/nodemailer.js";
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

    const result = faculties.map(({personalData }) => ({
      name: personalData.name,
      department: personalData.department,
      role: personalData.designation,
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching faculties", details: err.message });
  }
}

export const getRequests = async (req, res) => {
  if (req.profile.role === "ADMIN") { 
    const requests = await Request.find()
      .populate("user", "email")
      .populate("personal", "personalData.name personalData.department personalData.designation");
      console.log(requests);
      res.json(requests);
  }
  else {
    return res.status(400).json({
      error: "are you kidding you are not admin"
    })
  }
}



export const acceptRequests = async (req, res) => {
  const { rid } = req.body;

  try {
    // 1. Fetch Request
    const request = await Request.findById(rid);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 2. Fetch Associated Personal Profile (for User Info & Refs)
    const personalDoc = await PersonalSchema.findById(request.personal);
    if (!personalDoc) {
      return res.status(404).json({ error: "Associated Personal profile not found" });
    }

    // 3. Determine Target Document (Credentials vs Personal)
    let targetDoc;
    const modelName = request.model || "Credentials"; // Default to Credentials

    if (modelName === "Credentials") {
      if (!personalDoc.credentials) {
        return res.status(404).json({ error: "User has no credentials profile linked" });
      }
      targetDoc = await Credentials.findById(personalDoc.credentials);
    } else {
      targetDoc = personalDoc;
    }

    if (!targetDoc) {
      return res.status(404).json({ error: "Target document to update not found" });
    }

    // 4. Apply Updates
    const { updatedFields } = request;

    for (const [field, changes] of Object.entries(updatedFields)) {
      // Handle Array Operations (Standard for Credentials)
      if (Array.isArray(changes)) {
        if (!targetDoc[field]) targetDoc[field] = [];

        // Sort delete operations first to avoid index shifting issues? 
        // Or handle in reverse? 
        // Actually, if multiple ops exist, indices might shift. 
        // Assumption: Payload usually contains 1 op or handles consistency.
        // For simplicity and typical use case (1 edit per Save), direct application works.
        // If batching edits, we should be careful. 
        // Given current FE, it sends 1 item edit at a time.

        for (const item of changes) {
          const { _operation, _index, ...data } = item;

          if (_operation === 'add') {
            targetDoc[field].push(data);
          } else if (_operation === 'edit') {
            if (targetDoc[field][_index]) {
              targetDoc[field][_index] = data;
            }
          } else if (_operation === 'delete') {
            // Note: If multiple deletes happen in one batch, high-to-low index sorting matters.
            // But usually simplistic splice works for single item.
            if (targetDoc[field][_index]) {
              targetDoc[field].splice(_index, 1);
            }
          }
        }
        targetDoc.markModified(field);
      } else {
        // Fallback for direct object updates (if any)
        targetDoc[field] = changes;
        targetDoc.markModified(field);
      }
    }

    // 5. Save Changes
    await targetDoc.save({ validateBeforeSave: false });

    // 6. Send Notification Email
    // Safe navigation for name/dept in case personalData is missing structure
    const userName = personalDoc.personalData?.name || "Unknown Faculty";
    const userDept = personalDoc.personalData?.department || "Unknown Department";
    const hodEmail=await Hod.findOne({}) 

    await sendDataUpdateEmail(hodEmail,userName, userDept, updatedFields);

    // 7. Delete Request
    await Request.findByIdAndDelete(rid);

    res.json({ message: "Request accepted and changes applied successfully" });

  } catch (err) {
    console.error("Error evaluating request:", err);
    res.status(500).json({ error: "Failed to accept request", details: err.message });
  }
}

export const rejectRequests = async (req, res) => {
  const { rid } = req.body;
  try {
    const deleted = await Request.findByIdAndDelete(rid);
    if (!deleted) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ message: "Request rejected and removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request", details: err.message });
  }
}