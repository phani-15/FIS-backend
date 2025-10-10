import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import { validationResult } from "express-validator"

export const register=async(req,res)=>{
    try {
    const {email,password,phone,...registrationDetails}=req.body
    const faculty=new FacultySchema({email,password,phone})
    await faculty.save()
    const personalSchema=new PersonalSchema({
        user:faculty._id,
        ...registrationDetails
    })
    await personalSchema.save()
    return res.json({
        msg:"reagistration Succesfull !!",
        personalSchema
    })        
    } catch (error) {
        return res.status(400).json({
            error:+error.message
        })
    }
    
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    const user=await FacultySchema.findOne({email})
        if( !user){
            return res.status(400).json({
                error:"No member with this Credentials are found !"
            })
        }
        
        if(!user.authenticate(password)){
            return res.status(400).json({
                error:"passowrd didnt matched !"
            })
        }
        res.json({
            msg:"Login Succesfull !"
        })
        
}