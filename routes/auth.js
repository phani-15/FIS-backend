import express from "express"
import {check} from "express-validator"
import {login,register,adminlogin,hodlogin,hodregister,Iqaclogin,iqacRegister} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";
import { verifyOTP,sendmail,forgotPassword,resetPassword } from "../utils/ForgotPassword.js"; 
const router=express.Router()

//handlle Register
router.post("/register",register);
router.post("/hodregister",hodregister);
router.post("/iqacregister",iqacRegister);
router.post("/login",login)
router.post("/admin",adminlogin)
router.post("/iqac",Iqaclogin)
router.post("/hod",hodlogin)

//handle sending mail
router.post("/sendmail",sendmail)

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password/:token", resetPassword);


export default router