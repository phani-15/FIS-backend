import { createTransport } from "nodemailer";
import facultySchema from "../modals/FacultySchema.js";
import IqacSchema from '../modals/Iqac.js'
import hodSchema from '../modals/hod.js';
import adminSchema from '../modals/admin.js'
import crypto from "crypto";
import { ofcMails, adminMail } from "../modals/mails.js";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

export const sendmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Regarding the Testing purpose from vinay",
      html: `
        <p>Thank you for signing up! Please click the link below to verify your email and activate your account:</p>
        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email Now
        </a>
        <p>The link is valid for 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("Mail error:", error);

    return res.status(500).json({
      error: "Failed to send email",
    });
  }
};

const otpStore = new Map();
const forgotPassword = async (req, res) => {
  try {
    const { type, identifier } = req.body;

    if (!type || !identifier)
      return res.status(400).json({ error: "Type and identifier are required" });

    let user;
let email;

switch (type) {
  case "faculty":
    user = await facultySchema.findOne({ email: identifier });
    if (!user) return res.status(404).json({ error: "Faculty not found" });
    email = user.email;
    break;

  case "iqac":
    user = await IqacSchema.findOne({ role: identifier });
    if (!user) return res.status(404).json({ error: "IQAC role not found" });

    email = ofcMails[identifier];
    if (!email)
      return res.status(404).json({ error: "IQAC email not configured" });
    break;

  case "hod":
    user = await hodSchema.findOne({ department: identifier });
    if (!user) return res.status(404).json({ error: "HOD not found" });
    email = user.email;
    break;

  case "admin":
    user = await adminSchema.findOne({});
    if (!user) return res.status(404).json({ error: "Admin not found" });

    email = adminMail.mail;
    break;

  default:
    return res.status(400).json({ error: "Invalid user type" });
}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = crypto.randomBytes(20).toString("hex");

    otpStore.set(otpToken, {
      type,
      identifier,
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

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
      otpToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { otpToken } = req.params;

    if (!otp || !otpToken)
      return res.status(400).json({ error: "OTP and token required" });

    const data = otpStore.get(otpToken);
    if (!data)
      return res.status(400).json({ error: "Invalid or expired session" });

    if (data.expiresAt < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    if (data.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    return res.json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { otpToken } = req.params;

    if (!otpToken || !password)
      return res.status(400).json({ error: "Token and password required" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });

    const data = otpStore.get(otpToken);
    if (!data)
      return res.status(400).json({ error: "Invalid or expired session" });

    if (data.expiresAt < Date.now()) {
      otpStore.delete(otpToken);
      return res.status(400).json({ error: "OTP expired" });
    }

    let user;

    switch (data.type) {
      case "faculty":
        user = await facultySchema.findOne({ email: data.email });
          if (user) user.password = password;
        break;

      case "iqac":
        user = await IqacSchema.findOne({ role: data.identifier });
          console.log("Found IQAC user:", user);
        if (user) user.passcode = password
        break;

      case "hod":
        user = await hodSchema.findOne({ department: data.identifier });
        if (user) user.password = password
        break;

      case "admin":
        user = await adminSchema.findOne({});
        if (user) user.password = password
        break;
    }

    if (!user)
      return res.status(404).json({ error: "User not found" });
    await user.save();

    otpStore.delete(otpToken);

    return res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { identifier, oldpassword, newpassword, type } = req.body;

    if (!identifier || !oldpassword || !newpassword || !type)
      return res.status(400).json({ error: "All fields are required" });

    if (newpassword.length < 8)
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters long" });

    let Model, findCondition;

    switch (type) {
      case "faculty":
        Model = facultySchema;
        findCondition = { email: identifier };
        break;

      case "hod":
        Model = hodSchema;
        findCondition = { department: identifier };
        break;

      case "iqac":
        Model = IqacSchema;
        findCondition = { role: identifier };
        break;

    

      default:
        return res.status(400).json({ error: "Invalid user type" });
    }

    const user = await Model.findOne(findCondition);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    if (!user.authenticate(oldpassword))
      return res.status(400).json({ error: "Old password incorrect" });
    if (Model==IqacSchema)
    {
      user.passcode = newpassword;
    await user.save();
    }
      else
      {
user.password = newpassword;
    await user.save();
      }
    

    return res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export {forgotPassword}