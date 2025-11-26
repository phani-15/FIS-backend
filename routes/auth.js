import express from "express"
import {check} from "express-validator"
import {login,register,sendmail,adminlogin,hodlogin} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";

const router=express.Router()

//handlle Register
router.post("/register",register);
router.post("/login",login)
router.post("/admin",adminlogin)
router.post("/iqac",adminlogin)
router.post("/hod",hodlogin)

//handle sending mail
router.post("/sendmail",sendmail)

export default router