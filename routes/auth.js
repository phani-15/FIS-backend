import express from "express"
import {check} from "express-validator"
import {login,register,adminlogin,hodlogin,hodregister,dreg} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";
import { forgotPassword,resetPassword,verifyOTP,sendmail, changepassword } from "../utils/nodemailer.js";
import { upload } from "../utils/multer.js";
import { iqacRegister,ofclogin } from "../controllers/auth.js";
import { adminregister } from "../controllers/auth.js";
const router=express.Router()

//handlle Register
router.post("/dummyreg",dreg);

router.post("/register",upload.fields([{ name: "personalData[avatar]", maxCount: 1 }]),register);
router.post("/hodregister",hodregister);
router.post("/ofcregister",iqacRegister);
router.post("/adminregister",adminregister)
router.post("/login",login)
router.post("/admin",adminlogin)
router.post("/ofc",ofclogin)
router.post("/hod",hodlogin)

//handle sending mail
router.post("/sendmail",sendmail)

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp/:otpToken", verifyOTP);

router.post("/reset-password/:otpToken", resetPassword);
router.post("/changepassword", changepassword);




export default router