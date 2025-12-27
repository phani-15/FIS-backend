import FacultySchema from "../modals/FacultySchema.js";
import PersonalSchema from "../modals/PersonalSchema.js";
import AdminSchema from "../modals/admin.js";
import IqacSchema from "../modals/Iqac.js";
import HodSchema from "../modals/hod.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";


export const register = async (req, res) => {
  try {
    const { loginData, ...registrationDetails } = req.body;

    // Save faculty
    const faculty = new FacultySchema(loginData);
    await faculty.save();
    console.log("Successfully saved faculty !!");

    // Save personal info
    const personalSchema = new PersonalSchema({
      user: faculty._id,
      ...registrationDetails,
    });
    await personalSchema.save();
    console.log("Personal info saved successfully");

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
export const hodregister = async (req, res) => {
  try {
    const { email,department,password } = req.body;

    // Save faculty
    const faculty = await HodSchema.create({email,department,password});
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
    const { role, passcode } = req.body;
   
    const iqac = await IqacSchema.create({
      role,
      passcode
    });
    console.log(iqac)
 
    const token = jwt.sign(
      { _id: iqac._id, role: iqac.role },
      process.env.SECRET,
      {
        algorithm: "HS256",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    

    return res.json({
      msg: "IQAC Registration Successful!!",
      user: {
        id: iqac._id,
        role: iqac.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: "There was an error saving IQAC data",
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
  const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
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
  const { passCode } = req.body;
  const Admin = await AdminSchema.findOne({ passCode });
  const Iqac = await IqacSchema.findOne({ passCode });

  if (!Admin) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  const token = jwt.sign({ _id: Admin._id }, process.env.SECRET, {
    algorithm: "HS256",
  });
  res.cookie("token", token, { expire: new Date() + 99999 });

  return res.json({
    token,
    Admin: {
      id: Admin._id,
      passCode,
    },
  });
};
export const Iqaclogin = async (req, res) => {
  const {role,passcode } = req.body;

  const Iqac = await IqacSchema.findOne({ role });

  if (!Iqac) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  if(!Iqac.authenticate(passcode)){
    return res.status(400).json({
      error:"password didnt match"
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

export const  hodlogin = async (req, res) => {
  const { department, password } = req.body;
  const user = await HodSchema.findOne({ department });
  if (!user) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  if(!user.authenticate(password)){
    return res.status(400).json({
      error:"passoword didnt match"
    })
  }
  const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
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
  console.log(req.auth);
  
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
  console.log(req.auth);
  
  const checker = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!checker) {
    return res.status(400).json({
      error: "You are not Authenticated !",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {};

//this needs to be seen another time !!
