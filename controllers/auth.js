import FacultySchema from "../modals/FacultySchema.js";
import PersonalSchema from "../modals/PersonalSchema.js";
import AdminSchema from "../modals/admin.js";
import IqacSchema from "../modals/Iqac.js";
import HodSchema from "../modals/hod.js";
import AddDetailsSchema from "../modals/AddDetails.js"
import {ofcMails, adminMail } from "../utils/mails.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { createTransport } from "nodemailer";

export const register = async (req, res) => {
  try {
    // Reconstructed object (text fields)
    const data = req.body;
    const avatarFile = req.files?.["personalData[avatar]"]?.[0];
    if (avatarFile) {
      data.personalData.avatar = avatarFile.filename;
    }
    const { loginData, ...registrationDetails } = data

    // Save faculty
    const faculty = await FacultySchema.find({email:loginData.email})
    // Save personal info
    const details = await AddDetailsSchema.create({
      user: faculty[0]._id.toString()
    })
    const personalSchema = new PersonalSchema({
      user:faculty[0]._id.toString(),
      ...registrationDetails,
      credentials: details._id
    });
    await personalSchema.save();
    // Send response
    return res.json({
      msg: "Registration Successful!!",
      user: {
        id: faculty._id,
        email: faculty.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: "There was an error saving data",
    });
  }
};
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

export const dreg = async (req, res) => {
  try {
    const { email, password ,name } = req.body;
    console.log("data came was :",req.body);
    
    const faculty = await FacultySchema.create(req.body);
    if (!faculty) {
      return res.status(400).json({
        error: "Saving user failed",
      });
    }
    const token = jwt.sign(
      { id: faculty._id, email:email },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
    const registerLink = `http://localhost:5173/register/${token}`;
    // 📧 Send mail
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Complete Your Registration",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #4f46e5; height: 8px;"></div>
  <div style="padding: 40px;">    
    <p>Hello, <strong>${name ?? "Faculty Member"}</strong>,</p>
    <p>Your profile has been successfully provisioned within the <b>Faculty Information System (FIS)</b>. You now have access to Create an Account on Faculy information system.</p>
    <p>To initialize your account and verify your identity, please click the button below:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${registerLink}"
         style="display:inline-block; padding:14px 28px; background:#4f46e5; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
         Go to Registration
      </a>
    </div>

    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Default Credential/Password</p>
      <code style="font-family: monospace; font-size: 20px; color: #4f46e5; font-weight: bold;">${password}</code>
    </div>

    <p style="font-size: 14px; margin-top: 24px;">
      <span style="color: #e11d48; font-weight: 600;">Security Protocol:</span> 
      This is a system-generated password. For data integrity, you are required to update your credentials upon first login. This link will expire in <b>24 hours</b>.
    </p>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">

    <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">
      Regards,<br />
      <strong style="color: #475569;">Faculty Information System Team</strong><br />
     JNTUGV-CEV
    </p>
  </div>
  
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
    This is an automated system message. Please do not reply directly to this email.
  </div>
</div>
      `,
    }).catch((err) => {j  
      return res.status(500).json({
        error: `Failed to send email via nodemailer: ${err.message}`,
      });
    })

    return res.status(200).json({
      msg: "Registration successful. Email sent!",
    });
  } catch (err) {
    return res.status(500).json({
      error: `Registration failed cause :${err}`,
    });
  }
};
export const hodregister = async (req, res) => {
  try {
    const { email, department, password } = req.body;

    // Save faculty
    const faculty = await HodSchema.create({ email, department, password });

    // Generate JWT token
    const token = jwt.sign({ _id: faculty._id }, process.env.SECRET, {
      algorithm: "HS256",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: faculty.email,
      subject: "Registration Notice",
      html: `
       <p>Hello,</p>

<p>
  You have been successfully registered in the <strong>Faculty Information System</strong>.
</p>

<p>
  Your temporary login password is:
  <br />
  <strong>${password}</strong>
</p>

<p>
  To access the Faculty Information System, please click the link below:
</p>

<p>
  <a href="https://fis@jntugv.edu.in" target="_blank">
    Click here to visit the website
  </a>
</p>

<p>
  <strong>Note:</strong> This password has been assigned as a default credential for your department account.
  For security reasons, you are strongly advised to change your password immediately after logging in.
</p>

<p>
  Regards,<br />
  <strong>Faculty Information System Team</strong>
</p>

        
      `,
    });
    // Send response
    return res.json({
    
      user: {
        message:"Registration Succesful",
        token:token,
        id: faculty._id,
        email: faculty.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: "There was an error saving data",
    });
  }
};
export const iqacRegister = async (req, res) => {
  try {
    const { role, passcode } = req.body;

    if (!role || !passcode) {
      return res.status(400).json({ error: "Role and passcode are required" });
    }

    if (!ofcMails[role]) {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const existingRole = await IqacSchema.findOne({ role });
    if (existingRole) {
      return res.status(409).json({
        error: `${role} account already exists`,
      });
    }

    const iqac = new IqacSchema({ role });
    iqac.passcode = passcode;
    await iqac.save();

    const token = jwt.sign(
      { _id: iqac._id, role: iqac.role },
      process.env.SECRET,
      { algorithm: "HS256" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: ofcMails[role],
      subject: "Registration Notice",
      html: `
        <p>Hello,</p>

        <p>
          You have been successfully registered in the <strong>Faculty Information System</strong>.
        </p>

        <p>
          Your temporary login password is:
          <br />
          <strong>${passcode}</strong>
        </p>

        <p>
          To access the Faculty Information System, please click the link below:
        </p>

        <p>
          <a href="https://fis.jntugv.edu.in" target="_blank">
            Click here to visit the website
          </a>
        </p>

        <p>
          <strong>Note:</strong> This password has been assigned as a default credential.
          You are strongly advised to change your password immediately after logging in.
        </p>

        <p>
          Regards,<br />
          <strong>Faculty Information System Team</strong>
        </p>
      `,
    });

    return res.status(201).json({
      msg: "OFC Registration Successful",
      token:token,
      user: {
        id: iqac._id,
        role: iqac.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};



export const adminregister = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters"
      });
    }
    const admin = new AdminSchema();
    admin.passCode = password; 
    await admin.save();
    return res.status(201).json({
      message: "Admin registered successfully",
      adminEmail: adminMail.mail
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await FacultySchema.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "password didnt matched !",
    });
  }
  const token = jwt.sign({ _id: user._id, role: "user" }, process.env.SECRET, {
    algorithm: "HS256",
  });
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // must be true in production, but works on localhost with chrome flags
    sameSite: "none", // required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
    }
  })
};
export const adminlogin = async (req, res) => {
  const passCode = req.body.passCode?.trim();
  if (!passCode) {
    return res.status(400).json({ error: "Passcode required" });
  }
  const admin = await AdminSchema.findOne({ role:"ADMIN"});

  if (!admin.authenticate(passCode)){
    return res.status(400).json({
      error: "Passcode didnt matched !",
    });
  }
  if (!admin) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }

  const token = jwt.sign(
    { _id: admin._id ,role: "admin" },
    process.env.SECRET,
    { algorithm: "HS256" }
  );

  return res.json({
    token,
    admin: {
      _id: admin._id,
    },
  });
};


export const ofclogin = async (req, res) => {
  const { role, passcode } = req.body;
  const Iqac = await IqacSchema.findOne({ role });

  if (!Iqac) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  if (!Iqac.authenticate(passcode)) {
    return res.status(400).json({
      error: "password didnt match"
    })
  }
  const token = jwt.sign({ _id: Iqac._id ,role: "ofc"}, process.env.SECRET, {
    algorithm: "HS256",
  });
  res.cookie("token", token, { expire: new Date() + 99999 });

  return res.json({
    token,
    Iqac: {
      id: Iqac._id,
      passcode,
    },
  })
};

export const hodlogin = async (req, res) => {
  const { department, password } = req.body;
  const user = await HodSchema.findOne({ department });
  if (!user) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "passoword didnt match"
    })
  }
  const token = jwt.sign({ _id: user._id, role: "hod" }, process.env.SECRET, {
    algorithm: "HS256",
  });
  res.cookie("token", token, { expire: new Date() + 99999 });

  return res.json({
    token,
    user: {
      id: user._id
    },
  });
};

export const signout = (req, res) => {
  res.clearCookie("token");
};

export const isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

export const isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile.user._id.toString() == req.auth._id;
  if (!checker) {
    return res.status(400).json({
      error: "You are not Authenticated !",
    });
  }
  next();
};

export const isHodAuthenticated = (req, res, next) => {
  // Ensure both IDs are compared as strings
  const checker = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!checker) {
    return res.status(400).json({
      error: "You are not Authenticated !",
    });
  }
  next();
};
export const isiqacAuthenticated = (req, res, next) => {
  // Ensure both IDs are compared as strings
  const checker = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!checker) {
    return res.status(400).json({
      error: "You are not Authenticated !",
    });
  }
  next();
};

export const canviewProfile = (req, res, next) => {
  const isOwner = req.profile.user._id.toString() === req.auth._id.toString()
  const isHod = req.auth.role === "hod"
  const isofc = req.auth.role === "ofc"
  const isadmin = req.auth.role === "admin"
  if (!isOwner && !isHod && !isofc && !isadmin) {
    return res.status(400).json({
      error: "your access was denied !"
    })
  }
  next()
}

export const  isAdminAuthenticated = (req, res, next) => {
  // Ensure both IDs are compared as strings
  const checker = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!checker) {
    return res.status(400).json({
      error: "You are not Authenticated !",
    });
  }

  next();
};

