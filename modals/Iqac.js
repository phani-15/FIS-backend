import mongoose from "mongoose";

const iqacSchema=new mongoose.Schema({
    passCode:{type:String,required:true,minchar:8}
})

iqacSchema.method({

})

export default mongoose.model("IQAC",iqacSchema)