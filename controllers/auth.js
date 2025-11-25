    import FacultySchema from "../modals/FacultySchema.js"
    import PersonalSchema from "../modals/PersonalSchema.js"
    import { validationResult } from "express-validator"
    import jwt from "jsonwebtoken"
    import { expressjwt } from "express-jwt";
    import { createTransport } from "nodemailer"
    import crypto from "crypto"


    export const register = async (req, res) => {
        try {
            const { email, password, phone, ...registrationDetails } = req.body
            const faculty = new FacultySchema({ email, password, phone })
            await faculty.save()
            .then(res=>{console.log("succesfully saved faculty !!");
            })
            .catch(err=>console.log(err))
            const personalSchema = new PersonalSchema({
                user: faculty._id,
                ...registrationDetails
            })
            await personalSchema.save()
            .then(console.log("success")    
            )
            .catch(err=>console.log(err)
            )
            return res.json({
                msg: "registration Succesfull !!",
                personalSchema
            })
        } catch (error) {
            return res.status(400).json({
                error: "there is an error occured in saving into personal"
            })
        }

    }

    export const login = async (req, res) => {
        const { email, password } = req.body
        const user = await FacultySchema.findOne({ email })
        if (!user) {
            return res.status(400).json({
                error: "No member with this Credentials are found !"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "password didnt matched !"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { algorithm: 'HS256' })
        res.cookie("token", token, { expire: new Date() + 99999 })

        return res.json({
            token, user: {
                id: user._id,
                email,
                password
            }
        })
    }

    export const signout = (req, res) => {
        res.clearCookie("token")
    }

    export const isSignedIn = expressjwt({
        secret: process.env.SECRET,
        userProperty: "auth",
        algorithms: ["HS256"]
    })

    export const isAuthenticated = (req, res, next) => {
        const checker = req.profile && req.auth && req.profile._id.toString() == req.auth._id
        if (!checker) {
            return res.status(400).json({
                error: "You are not Authenticated !"
            })
        }
        next()
    }


//this needs to be seen another time !!
const transporter = createTransport({
    service: "gmail",
    auth: {
        user:`${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`
    }
})

export const sendmail = async (req,res) => {
    const {email}=req.body
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
    }
    try {
        await transporter.sendMail(sendingDescription).then(em=>console.log(em)
        )

        } catch (error) {
            res.json({
                error: error.message
            })
        }

    }
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 1️⃣ Check if user exists
    const user = await FacultySchema.findOne({ email }).then(console.log("user  found !!")
    )
    

    // ✅ Do NOT reveal if email exists — security measure
    if (!user) {
      return res.json({ message: "user need to  register" });
    }

    // 2️⃣ Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3️⃣ Hash token before saving to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 4️⃣ Token expires in 15 min
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save().then (console.log("user savd succefully !!")
    ).catch(err=>console.log(err))

    // 5️⃣ URL that frontend reset page will handle
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 6️⃣ Send reset email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Faculty Information System",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}" style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `,
    })
    

    return res.json({ message: "Password reset link sent to email!" ,user});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || !token){
        return res.status(400).json({ error: "Password is required" });
    }
   
    try {
        const user = await FacultySchema.findOne({
            resetPasswordExpires: { $gt: Date.now() } ,// token not expired
             resetPasswordToken: token
        }).then(console.log("user found for resetting password !!"))
        .catch(err=>console.log(err));

        if (!user)
            return res.status(400).json({ error: "Invalid or expired reset token" });

        // ✅ Set new password using virtual field
        user.password = password;

        // ✅ Remove reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.json({ msg: "Password reset successful! Please login." });

    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};