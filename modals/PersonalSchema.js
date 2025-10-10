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
        }
    }
},{timestamps:true})

export default mongoose.model("Personal", personalSchema);