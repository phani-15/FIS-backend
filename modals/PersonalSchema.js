import mongoose from "mongoose";

const personalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    personalData:{
        DOB: { type: Date, required: true }, 
        area:{ type: String},
        city:{ type: String},
        college: {type:String ,enum: ["University College of Engineering", "College of PharmaCeutical Sciences"], required: true },
        date_of_join:{type:String,required:true}    ,
        department: { type: String, required: true },
        designation: { type: String, required: true },
        father: { type: String, required: true },
        gender: { type: String, required: true },
        marital: { type: String, required: true },  
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        phone : { type: String},
    }, 
    education: {
        tenth: {
            percentage: { type: String,},
            school: { type: String, required: true, trim: true },
            year: { type: String, required: true },
        },
        twelth: {
            college: { type: String, required: true, trim: true },
            percentage: { type: String,  },
            type: {type:String, enum: ["Intermediate", "diploma"], required: true },
            year: { type: String, required: true },
        },
        degree: {
            college: { type: String, required: true, trim: true },
            degreeName: { type: String, required: true },
            percentage: { type: String,},
            specialization: { type: String, required: true },
            title: { type: String, required: true },
            university: { type: String, required: true, trim: true },
            year: { type: String, required: true }
        },
        pg: {
            college: { type: String, required: true, trim: true },
            course: { type: String, required: true },
            percentage: { type: String,  },
            specialization: { type: String, required: true },
            university : { type: String, required: true, trim: true },
            year: { type: String, required: true },
        },
        phd: [{
            University: { type: String, minchar: 4 ,required:true},
            department: { type: String, minchar: 2 },
            specialization: { type: String ,required:true},
            under_the_proffessor: { type: String },
            year: { type: Number, minchar: 4 }

        }],
        postdoc: [{
            University: { type: String, minchar: 4 },
            specialization: { type: String },
            under_the_proffessor: { type: String },
            year: { type: Number, minchar: 4 }
        }]
    },
    experience: [
        {
            designation: { type: String, minchar: 2 },
            institute: { type: String, minchar: 4 },
            from: { type: Number, min: 1947 },
            to: { type: String, },
        }
    ],
    administrativeService: [{
        designation: { type: String, minchar: 2 },
        from: { type: Number, min: 1947 },
        to: { type: String,  }
    }],
    otherAdministrativeService: [{
        designation: { type: String, minchar: 2 },
        institute: { type: String, minchar: 4 },
        from: { type: Number, min: 1947 },
        to: { type: String, }
    }],
    credentials:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Credentials",
        default:""
    }

}, { timestamps: true })

export default mongoose.model("Personal", personalSchema);