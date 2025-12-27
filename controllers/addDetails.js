import expess from "express"
import Credential from "../modals/AddDetails.js"

export const getCredentialById=async (req,res,next,id)=>{
    const cred=await Credential.findById(id)
    if(!cred){
        return res.status(400).json({
            error:"no cred was found by the given ID"
        })
    }
    req.credential=cred
    next();
}
export const createCredential=async (req,res)=>{
    const {group,formdata}=req.body
    const updatedcred=await Credential.findByIdAndUpdate(req.credential._id,{
        $push:{[group]:formdata}
    },{new:true})

    if (!updatedcred) {
        return res.status(400).json({
            error:"there was an error on updating the Credentials"
        })
    }
    res.json(updatedcred)
}