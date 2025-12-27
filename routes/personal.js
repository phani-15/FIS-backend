import express from "express"
import { defaultArgs } from "puppeteer"

import {getUserById,getDeatils,getAllUsers} from "../controllers/personal.js"
import {isSignedIn,isAuthenticated, canviewProfile} from "../controllers/auth.js"
const router=express.Router()

router.param("userId",getUserById)


//for testing purpose only not for actual website
router.get("/personal/:userId",isSignedIn,canviewProfile,getDeatils)




router.get('/users/all', getAllUsers);

export default router