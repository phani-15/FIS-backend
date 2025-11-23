import express from "express"
import {check} from "express-validator"
import {login,register,sendmail} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";

const router=express.Router()

//handlle Register
router.post("/register",register);
router.post("/login",login)

//handle sending mail
router.post("/sendmail",sendmail)

export default router