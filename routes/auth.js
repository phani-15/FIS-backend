import express from "express"
import {check} from "express-validator"
import {login,register,sendmail} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";
import { forgotPassword } from "../controllers/auth.js";
import { resetPassword } from "../controllers/auth.js";
import { verifyOTP } from "../controllers/auth.js"; 
const router=express.Router()

//handlle Register
router.post("/register",register);
router.post("/login",login)

//handle sending mail
router.post("/sendmail",sendmail)

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password/:token", resetPassword);


export default router