import express from "express"
import {getUserById} from "../controllers/personal.js"
import {isSignedIn,isAuthenticated} from "../controllers/auth.js"
import {getCredentialById,createCredential,getCredDetails} from "../controllers/addDetails.js"
import {uploadCred} from "../utils/multer.js"
const router=express.Router()

router.param("userId",getUserById)
router.param("credentialId",getCredentialById)
//send the data from teh frontend 
router.put("/ac/:userId/:credentialId",isSignedIn,isAuthenticated,uploadCred.fields([{name:"Document",maxCount:1}]),createCredential)

//get data to the frontend
router.get("/vc/:userId/:credentialId",isSignedIn,isAuthenticated,getCredDetails)

export default router;