import express from "express"
import {check} from "express-validator"
import {login,register,adminlogin,hodlogin,hodregister} from "../controllers/auth.js"
import {sendmail,forgotPassword,resetPassword,verifyOTP} from "../utils/nodemailer.js"
import { iqacRegister,ofclogin } from "../controllers/auth.js";
import {upload} from "../utils/multer.js"
const router=express.Router()

//handlle Register
router.post("/register",upload.any(),register);
router.post("/hodregister",hodregister);
router.post("/iqacregister",iqacRegister);
router.post("/login",login)
router.post("/admin",adminlogin)
router.post("/ofc",ofclogin)
router.post("/hod",hodlogin)

//handle sending mail
router.post("/sendmail",sendmail)

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password/:token", resetPassword);


export default router