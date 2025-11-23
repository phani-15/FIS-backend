import mongoose from "mongoose";

const personalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    fatherName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    marital: { type: String, required: true },
    education: {
        Tenth: {
            score: { type: String, required: true },
            year: { type: String, required: true },
            institue: { type: String, required: true, trim: true }
        },
        Twelth: {
            score: { type: String, required: true },
            year: { type: String, required: true },
            institue: { type: String, required: true, trim: true }
        },
        Graduation: {
            score: { type: String, required: true },
            Degree: { type: String, required: true },
            year: { type: String, required: true },
            institue: { type: String, required: true, trim: true },
            specialization: { type: String, required: true }
        },
        PostGraduation: {
            score: { type: String, required: true },
            Degree: { type: String, required: true },
            year: { type: String, required: true },
            institue: { type: String, required: true, trim: true },
            specialization: { type: String, required: true }
        },
        phd:[{
                specialization: {type:String},
                under_the_proffessor: {type:String},
                department: {type:String,minchar:2},
                University: {type:String,minchar:4},
                year : {type:Number,max:new Date().getFullYear(),minchar:4} 

        }]
    },
    experience_data:[
        {
            institute: {type:String,minchar:4},
            designation: {type:String,minchar:2}, 
            from: {type:Number,min:1947}, 
            to: {type:Number,max:new Date().getFullYear()}, 
            certificate: {type:String}
        }
    ],
    administrative_Service:[{
        designation: {type:String,minchar:2}, 
        from: {type:Number,min:1947}, 
        to: {type:Number,max:new Date().getFullYear()}
    }],
    other_administrative_service:[{
         institute: {type:String,minchar:4}, 
         designation: {type:String,minchar:2}, 
         from: {type:Number,min:1947}, 
         to: {type:String,max:new Date().getFullYear()} 
    }]

},{timestamps:true})

export default mongoose.model("Personal", personalSchema);