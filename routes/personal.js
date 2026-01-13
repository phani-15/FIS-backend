import express from "express"
import { defaultArgs } from "puppeteer"

import {getUserById,getDeatils,addRequests} from "../controllers/personal.js"
import {isSignedIn,isAuthenticated, canviewProfile} from "../controllers/auth.js"
const router=express.Router()

router.param("userId",getUserById)


//read routes
router.get("/personal/:userId",isSignedIn,canviewProfile,getDeatils)

router.post("/addreq/:userId",isSignedIn,isAuthenticated,addRequests)

export default router