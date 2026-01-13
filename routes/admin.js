import express from 'express';
import {isSignedIn,isAdminAuthenticated} from "../controllers/auth.js"
import { getadminByID,getAdminDetails,getRequests,acceptRequests,rejectRequests} from '../controllers/admin.js';


const router=express.Router() 


router.param("adminID",getadminByID)


router.get("/admin/:adminID",isSignedIn,isAdminAuthenticated,getAdminDetails);
router.get("/request/:adminID",isSignedIn,isAdminAuthenticated,getRequests);

router.post("/requestac/:adminID",isSignedIn,isAdminAuthenticated,acceptRequests);
router.post("/requestrej/:adminID",isSignedIn,isAdminAuthenticated,rejectRequests);

export default router   