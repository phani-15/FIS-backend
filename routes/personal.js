import express from "express"

import { getUserById, getDeatils, addRequests, updatePersonal } from "../controllers/personal.js"
import { isSignedIn, isAuthenticated, canviewProfile } from "../controllers/auth.js"
const router = express.Router()

router.param("userId", getUserById)


//read routes
router.get("/personal/:userId", isSignedIn, canviewProfile, getDeatils)
router.post("/addreq/:userId", isSignedIn, isAuthenticated, addRequests)
router.post("/personal/update/:userId", isSignedIn, isAuthenticated, updatePersonal)

export default router