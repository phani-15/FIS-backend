import mongoose from "mongoose";
const adminSchema=new mongoose.Schema({
    passCode:{type:String,required:true}
})

export default mongoose.model("Admin",adminSchema)