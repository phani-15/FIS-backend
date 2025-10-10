import express from "express"
import {check} from "express-validator"
import {login,register} from "../controllers/auth.js"
import { defaultArgs } from "puppeteer";

const router=express.Router()

//handlle Reagister
router.post("/register",register);

//handle Login
router.post("/login",login)

export default router