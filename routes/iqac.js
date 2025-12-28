import express from 'express';
import {isSignedIn,isiqacAuthenticated} from "../controllers/auth.js"
import {getiqacByID,getiqacDetails} from "../controllers/iqac.js"

 const router=express.Router()        
 
router.param("iqacid",getiqacByID)
router.get("/iqac/:iqacid",isSignedIn,isiqacAuthenticated,getiqacDetails);



 export default router
    