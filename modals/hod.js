import mongoose from "mongoose";
const hodSchema=new mongoose.Schema({
    department:{type:String,required:true},
    password:{type:String,required:true}        
})

export default mongoose.model("HOD",hodSchema)