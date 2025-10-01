import mongoose from "mongoose";

const personalSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Faculty",
        required : true,
    },
    name : { type: String, required: true },
    designation : { type: String, required: true },
    department : { type: String, required: true },
    fatherName : { type: String, required: true },
    dob : { type: Date, required: true },
    gender : { type: String, required: true },
    marrital : { type: String, required: true },
    education : {
        Tenth : {
            score : {type:String, required:true},
            year : {type:String, required:true},
            institue : {type:String, required:true}
        },
        Twelveth : {
            score : {type:String, required:true},
            year : {type:String, required:true},
            institue : {type:String, required:true}
        },
        Graduation : {
            score : {type:String, required:true},
            Degree :{type:String, required:true},
            year : {type:String, required:true},
            institue : {type:String, required:true},
            specialization : {type:String, required:true}
        },
        PostGraduation : {
            score : {type:String, required:true},
            Degree :{type:String, required:true},
            year : {type:String, required:true},
            institue : {type:String, required:true},
            specialization : {type:String, required:true}
        }
    }
})