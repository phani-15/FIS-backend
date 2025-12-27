import FacultySchema from "../modals/FacultySchema.js";
import PersonalSchema from "../modals/PersonalSchema.js";
import AdminSchema from "../modals/admin.js";
import IqacSchema from "../modals/Iqac.js";
import HodSchema from "../modals/hod.js";
import AddDetailsSchema from "../modals/AddDetails.js"
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

export const register = async (req, res) => {
  try {
    // Reconstructed object (text fields)
    const data = req.body;

    // Attach file(s) back to object
    req.files.forEach(file => {
      if (file.fieldname === "personalData[avatar]") {
        data.personalData.avatar = file.filename;
      }
    });
      const {loginData,...registrationDetails}=data
      
      // Save faculty
      const faculty = new FacultySchema(loginData);
      await faculty.save();
      console.log("Successfully saved faculty !!");

      // Save personal info
      
      const details=await AddDetailsSchema.create({
        user:faculty._id
      })
      const personalSchema = new PersonalSchema({
        user: faculty._id,
        ...registrationDetails,
        credentials:details._id
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
  const token = jwt.sign({ _id: user._id ,role:"user" }, process.env.SECRET, {
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
  const { passCode } = req.body;
  const Iqac = await IqacSchema.findOne({ passCode });

  if (!Iqac) {
    return res.status(400).json({
      error: "No member with this Credentials are found !",
    });
  }
  const token = jwt.sign({ _id: Iqac._id }, process.env.SECRET, {
    algorithm: "HS256",
  });
  res.cookie("token", token, { expire: new Date() + 99999 });

  return res.json({
    token,
    Iqac: {
      id: Iqac._id,
      passCode,
    },
  });
};

export const hodlogin = async (req, res) => {
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
  const token = jwt.sign({ _id: user._id ,role:"hod" }, process.env.SECRET, {
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

export const canviewProfile=(req,res,next)=>{    
  const isOwner=req.profile.user._id.toString()===req.auth._id.toString()
  const isHod=req.auth.role==="hod"
  if(!isOwner && !isHod){
    return res.status(400).json({
      error:"your access was denied !"
    })
  }
  next()
}

export const isAdmin = (req, res, next) => {};
