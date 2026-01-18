import mongoose from "mongoose"
import Personal from "./PersonalSchema.js"
const requestSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: Personal, required: true },  //this is personal id we populate from  user to get email
        personal: { type: mongoose.Schema.Types.ObjectId, ref: Personal, required: true },
        isPending: { type: Boolean, default: true },
        originalProfile: {},
        updatedFields: {},
        model: {type: String,default: "Credentials",immutable: true,enum: ["Credentials"]}
    }, { timestamps: true }
)

export default mongoose.model("Request", requestSchema)
