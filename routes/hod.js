import express from 'express';
import {isSignedIn,isHodAuthenticated} from "../controllers/auth.js"
import {gethodByID,gethodDetails} from "../controllers/hod.js"
import {hodregister} from "../controllers/auth.js"
 const router=express.Router()        
 
router.param("hodId",gethodByID)
router.get("/hod/:hodId",isSignedIn,isHodAuthenticated,gethodDetails);



 export default router
