import FacultySchema from "../modals/FacultySchema.js";
import PersonalSchema from "../modals/PersonalSchema.js";
import AdminSchema from "../modals/admin.js";
import IqacSchema from "../modals/Iqac.js";
import HodSchema from "../modals/hod.js";
import AddDetailsSchema from "../modals/AddDetails.js"
import { adminMail } from "../utils/mails.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { createTransport } from "nodemailer";
import { ofcMails,adminMail } from "../modals/mails.js";

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
    console.log("Personal info saved successfully");
    // Send response
    return res.json({
      msg: "Registration Successful!!",
      user: {
        id: faculty._id,
        email: faculty.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
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
    const { email, password } = req.body;

    const faculty = await FacultySchema.create(req.body);

    if (!faculty) {
      return res.status(400).json({
        error: "Saving user failed",
      });
    }
    const token = jwt.sign(
      { id: faculty._id, email: faculty.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    const registerLink = `http://localhost:5173/register/${token}`;

    // 📧 Send mail
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: faculty.email,
      subject: "Complete Your Registration",
      html: `
        <p>Hello,</p>
        <p>You have been registered in the Faculty Information System.</p>
        <p>Please click the button below to complete your registration:</p>

        <a href="${registerLink}"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#4f46e5;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
             font-weight:600;
           ">
           Complete Registration
        </a>
        <p>The password for your email is :${password}
        <p> <strong>Note:</strong>This password has been assigned as a default credential. For security reasons, you are advised to change your password immediately after logging in.</p>
        <p style="margin-top:12px;">
          This link is valid for <b>24 hours</b>.
        </p>

      <p>
  Regards,<br />
  <strong>Faculty Information System Team</strong>
</p>
      `,
    });

    return res.status(200).json({
      msg: "Registration successful. Email sent!",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      error: "Registration failed",
    });
  }
};
export const hodregister = async (req, res) => {
  try {
    const { email, department, password } = req.body;

    // Save faculty
    const faculty = await HodSchema.create({ email, department, password });
    console.log(faculty);

    console.log("Successfully saved HOD !!");
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
    console.error("Error during registration:", error);
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
    console.error("Admin register error:", error);
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
  // console.log(req.profile._id.toString === req.auth._id);
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

