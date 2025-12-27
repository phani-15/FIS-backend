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

export const isAdmin = (req, res, next) => {};

//this needs to be seen another time !!
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

export const sendmail = async (req, res) => {
  const { email } = req.body;
  const sendingDescription = {
    from: process.env.EMAIL,
    to: email,
    subject: "Regarding the Testing purpose from vinay",
    html: `
            <p>Thank you for signing up! Please click the link below to verify your email and activate your account:</p>
            <a href="" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Verify Email Now
            </a>
            <p>The link is valid for 1 hour.</p>
        `,
  };
  try {
    await transporter
      .sendMail(sendingDescription)
      .then((em) => console.log(em));
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
// Store OTP and expiry temporarily (NOT in database)
const otpStore = new Map();
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await FacultySchema.findOne({ email });
    if (!user) return res.json({ message: "User not registered" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate unique token for this OTP session
    const otpToken = crypto.randomBytes(20).toString("hex");

    // Save in memory
    otpStore.set(otpToken, {
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP - Faculty Information System",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
    <h2 style="color: #0056b3;">Faculty Information System</h2>

    <p>Dear User,</p>

    <p>
      We received a request to reset the password for your
      <strong>Faculty Information System</strong> account. 
      To proceed with resetting your password, please use the One-Time Password (OTP) provided below:
    </p>

    <div style="background: #f4f6f9; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0;">
      <h1 style="letter-spacing: 5px; font-size: 32px; margin: 0; text-align: center;">
        ${otp}
      </h1>
    </div>

    <p>
      This OTP is valid for <strong>10 minutes</strong>. 
      Do not share it with anyone. For security reasons, the OTP will expire automatically.
    </p>

    

    <br />

    <p>Regards,<br>
    <strong>Faculty Information System Support Team</strong></p>

    <hr style="margin-top: 30px;">
    <small style="color: #777;">
      This is an automated message. Please do not reply to this email.
    </small>
  </div>
      `,
    });

    return res.json({
      message: "OTP sent successfully",
      otpToken, // ⬅️ frontend will use this instead of email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp)
      return res.status(400).json({ error: "OTP token and OTP are required" });

    const data = otpStore.get(otpToken);

    if (!data)
      return res
        .status(400)
        .json({ error: "OTP not generated or expired session" });

    if (data.expiresAt < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    if (data.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    return res.json({
      message: "OTP verified successfully",
      email: data.email, // ⬅️ frontend now gets email automatically
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { otpToken, password } = req.body;

    if (!otpToken || !password)
      return res.status(400).json({ error: "Missing fields" });

    const data = otpStore.get(otpToken);
    if (!data) return res.status(400).json({ error: "Invalid session" });

    const user = await FacultySchema.findOne({ email: data.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = password;
    await user.save();

    // Clear OTP session
    otpStore.delete(otpToken);

    return res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
