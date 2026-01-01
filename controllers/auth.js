import FacultySchema from "../modals/FacultySchema.js";
import PersonalSchema from "../modals/PersonalSchema.js";
import AdminSchema from "../modals/admin.js";
import IqacSchema from "../modals/Iqac.js";
import HodSchema from "../modals/hod.js";
import AddDetailsSchema from "../modals/AddDetails.js"
import { adminMail } from "../modals/mails.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";


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

export const dreg=async (req,res)=>{
  const {email,password}=req.body;
  const faculty=await FacultySchema.create(req.body)
  if (!faculty) {
    return res.status(400).json({
      error:"saving user failed"
    })
  }
  const token=jwt.sign({email:email},process.env.SECRET,{expiresIn:"24h"})
  return res.json({
    msg: "Registration Successful!!",
      user: {
        id: faculty._id,
        email: faculty.email,
        token:token
      },  
  })
}
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
export const iqacRegister = async (req, res) => {

  try {
    const iqac = await IqacSchema.create(req.body).catch(err => {
      console.log(err);
    })
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
    })
    return res.json({
      msg: "OFC Registration Successful!!",
      user: {
        id: iqac._id,
        role: iqac.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: "There was an error saving OFC data",
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
    const existingAdmin = await AdminSchema.findOne({});
    if (existingAdmin) {
      return res.status(400).json({
        error: "Admin already exists"
      });
    }
    const admin = new AdminSchema();
    admin.password = password; 
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

//check user during registration middleware
export const checkUser = async (req, res, next) => {
  const { email, phone } = req.body;
  if (
    (await FacultySchema.findOne(email)) ||
    (await FacultySchema.findOne(phone))
  ) {
    return res.status(400).json({
      error: " user with the given credentials exist go to sign in ",
    });
  }
  next();
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
    secure: true, // must be true in production, but works on localhost with chrome flags
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
  console.log("REQ BODY:", req.body);

  const passCode = req.body.passCode?.trim();

  if (!passCode) {
    return res.status(400).json({ error: "Passcode required" });
  }

  const admin = await AdminSchema.findOne({ passCode });

  console.log("ADMIN FOUND:", admin);

  if (!admin) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }

  const token = jwt.sign(
    { _id: admin._id },
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
  const token = jwt.sign({ _id: Iqac._id }, process.env.SECRET, {
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
  if (!isOwner && !isHod) {
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
