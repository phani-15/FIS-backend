import FacultySchema from "../modals/FacultySchema.js"
import PersonalSchema from "../modals/PersonalSchema.js"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import { expressjwt} from "express-jwt";

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
                error:"password didnt matched !"
            })
        }
       const token= jwt.sign({_id:user._id},process.env.SECRET,{algorithm:'HS256'})
       res.cookie("token",token,{expire:new Date()+99999})

       return res.json({
        token,user:{
            id:user._id,
            email,
            password
        }
       })
}

export const signout=(req,res)=>{
    res.clearCookie("token")
}

export const isSignedIn=expressjwt({
    secret:process.env.SECRET,
    userProperty:"auth",
    algorithms:["HS256"]
})

export const isAuthenticated=(req,res,next)=>{
    const checker=req.profile && req.auth && req.profile._id.toString()==req.auth._id
    if(!checker){
        return res.status(400).json({
            error:"You are not Authenticated !"
        })
    }
    next()
}