import { createTransport } from "nodemailer";

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