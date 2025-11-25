import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt";
import { createTransport } from "nodemailer"

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