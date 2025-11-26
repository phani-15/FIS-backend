import mongoose from "mongoose";

const iqacSchema=new mongoose.Schema({
    passCode:{type:String,required:true,unique:true,minchar:1}
})

iqacSchema.method({

})

export default mongoose.model("IQAC",iqacSchema)