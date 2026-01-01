import express from 'express';
import {isSignedIn,isAdminAuthenticated} from "../controllers/auth.js"
import { getadminByID,printdet } from '../controllers/admin.js';
const router=express.Router() 
router.param("adminID",getadminByID)
router.get("/admin/:adminID",isSignedIn,isAdminAuthenticated,printdet);
router.get('/test',(req,res)=>
{
    res.send("Hello world")
})

export default router   