import express from 'express';
import {isAuthenticated, isSignedIn,isiqacAuthenticated} from "../controllers/auth.js"
import {getiqacByID,getiqacDetails,getReportDataForAll,getFacultyforReport, getReportDataForSome} from "../controllers/iqac.js"

 const router=express.Router()        
 
router.param("ofcId",getiqacByID)
//get routes 
router.get("/ofc/:ofcId",isSignedIn,isiqacAuthenticated,getiqacDetails);
router.post("/ofcgfr/:ofcId",isSignedIn,isiqacAuthenticated,getFacultyforReport)
router.post("/ofcreport/:ofcId",isSignedIn,isiqacAuthenticated,getReportDataForSome)

//for future testing 
router.get("/ofcreportall/:ofcId",isSignedIn,isiqacAuthenticated,getReportDataForAll)


 export default router
    