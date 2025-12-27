import express from "express"
import {getUserById} from "../controllers/personal.js"
import {isSignedIn,isAuthenticated} from "../controllers/auth.js"
import {getCredentialById,createCredential} from "../controllers/addDetails.js"
const router=express.Router()

router.param("userId",getUserById)
router.param("credentialId",getCredentialById)
//send the data from teh frontend 
router.put("/ac/:userId/:credentialId",isSignedIn,isAuthenticated,createCredential)

export default router;